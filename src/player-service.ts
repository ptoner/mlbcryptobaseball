import * as request from "request-promise-native";
import { FileService } from "./file_service";
import { Card } from "./dto/card";
import { CardService } from "./card-service";






class PlayerService {

    constructor(
        private contractInstance: any,
        private ipfs: any,
        private fileService: FileService,
        private cardService: CardService
    ) {}

    async downloadAll(start: number, finish: number): Promise<void> {

        const self = this

        let counter: number = start
    
        while(counter <= finish) {
    
            try {
                let tokenId = await this.contractInstance.methods.tokenByIndex(counter).call()
                
                await self.downloadToken(tokenId)
    
                counter++
                
            } catch(ex) {
                console.log(ex)
            }    
        }
    }

    async downloadToken(tokenId: number) : Promise<void> {

        console.log(`Downloading card with tokenId: ${tokenId}`)
                
        let card: Card = await this.fetchCardByTokenId(tokenId)

        return this.saveCardToIpfs(card)

    }

    async processAll(): Promise<void> {


        let files = await this.ipfs.files.ls('/mlbc')
        for (let file of files) {

            let tokenId = file.name.replace('.json', '')

            let card:Card = await this.getCardFromIpfs(tokenId)


            let existingCard: Card = await this.cardService.getCard(tokenId)

            if (existingCard) {
                await this.cardService.deleteCard(tokenId)
            }

            await this.cardService.saveCard(card)

        }

    }

    async processToken(tokenId: number ) : Promise<void> {

        let card: Card = await this.getCardFromIpfs(tokenId)

        await this.cardService.saveCard(card)
    }

    async saveCardToIpfs(card: Card) : Promise<void> {

        let path: string = `/mlbc/${card.tokenID}.json`

        console.log(`Writing card with token ${card.tokenID} to ${path}`)

        return this.fileService.writeToAll(card, [path])

    }

    async getCardFromIpfs(tokenId: number) : Promise<Card> {

        let card: Card = await this.fileService.loadFile(`/mlbc/${tokenId}.json`)

        return card
    }


    async fetchCardByTokenId(tokenId: number): Promise<Card> {
        const player = await request.get({
            uri: ' https://api-dot-cryptobaseball-b691f.appspot.com/playerId/' + tokenId  
        })

        let parsed: Card = JSON.parse(player).result

        return parsed 
    }

}





export { PlayerService}