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

        card = await this.translateImages(card)


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


    async translateImages(card: Card) : Promise<Card> {

        if (!card.imagesUrl) return 

        card.imagesUrl.threeSixtyImages = await this.translateImagesToIpfs(card.imagesUrl.threeSixtyImages)
        card.imagesUrl.featureImages = await this.translateImagesToIpfs(card.imagesUrl.featureImages)
        card.imagesUrl.bannerImage = await this.translateImageToIpfs(card.imagesUrl.bannerImage)
        card.imagesUrl.thumbnailImage = await this.translateImageToIpfs(card.imagesUrl.thumbnailImage)

        return card
    }

    async translateImagesToIpfs(images) : Promise<any> {
        let updated = {}

        for (let key in images) {
            let imageUrl = images[key]
            
            let imagePath = await this.translateImageToIpfs(imageUrl)

            updated[key] = imagePath
            
        }

        return updated
    }


    async translateImageToIpfs(imageUrl) : Promise<string> {
        
        const imagePath: string = imageUrl.replace('https://s3-us-west-1.amazonaws.com/crypto-baseball/Thumbnails/', '')

        let stat
        
        try {
            stat = await this.ipfs.files.stat('/mlbc/images/' + imagePath)
        } catch(ex) {}

        if (!stat || !stat.hash) {

            const imageContent = await request.get({
                uri: imageUrl,
                encoding: null
            })

            await this.ipfs.files.write( '/mlbc/images/' + imagePath, new Buffer(imageContent), {
                create: true, 
                parents: true, 
                truncate: true
            })
        }

        return imagePath
    }


    async saveCardToIpfs(card: Card) : Promise<void> {

        let path: string = `/mlbc/${card.tokenID}.json`

        console.log(`Writing card with token ${card.tokenID} to ${path}`)

        return this.fileService.writeToAll(card, [path])

    }

    async getCardFromIpfs(tokenId: number) : Promise<Card> {

        let card: Card

        try {
            let fileContents: Buffer  = await this.ipfs.files.read(`/mlbc/${tokenId}.json`)
            card = JSON.parse(fileContents.toString())
        } catch(ex) {
            //File not found
            // console.log(`File not found: ${filename}`)
        }

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