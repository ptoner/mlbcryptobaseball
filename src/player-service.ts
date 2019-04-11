import * as request from "request-promise-native";
import { FileService } from "./file_service";


class Card {
    public id: number
    public attributes: string
    public visualString: string 
    public uniformNumber: Number 
    public positionName: string 
    public gameCardTeamID: Number 
    public teamName: string 
    public positionId: Number 
    public attachments: string 
    public playerOverrideId: string 
    public mlbPlayerInfo: MlbPlayerInfo
    public stance: string 
    public isPromotional: boolean 
    public isAttached: number 
    public isPlaying: boolean
    public tokenID: number 
    public generationSeason: 2018 
    public creationTimestamp: string 
    public attachmentString: string 
    public abilityString: string 
    public earnedBy: string 
    public gloveType: string 
    public sequenceId: number 
    public earnedByString: string 
    public mlbPlayerId: number 
    public teamId: number 
    public allAttributes: string 
    public mlbGameId: number 
    public type: string 
    public batType: string 
    public imagesURL: any 

}


class MlbPlayerInfo {
    public id: number
    public status: string 
    public position: string 
    public lastName: string 
    public firstName: string 
    public playerId: number 
    public debutDate: string 
    public fullName: string 
    public mlbTeamId: number  
    public number: number 
}

class PlayerService {

    constructor(
        private contractInstance: any,
        private query: any,
        private ipfs: any,
        private fileService: FileService
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
                
        let card: Card = await this.getCardByTokenId(tokenId)

        return this.saveCardToIpfs(card)

    }


    async processAll(): Promise<void> {


        let files = await this.ipfs.files.ls('/mlbc')
        for (let file of files) {

            console.log(file)

            // let filename = `${folderName}/${file.name}`
            // try {
            //     let result = await this.loadFile(filename)
            //     results.push(result)
            // } catch (ex) {
            //     // console.log(`Error reading file: ${filename}`)
            //     // console.log(ex)
            // }
        }
        


    }

    async processToken(tokenId: number ) : Promise<void> {

        let card: Card = await this.getCardFromIpfs(tokenId)

        await this.saveCard(card)
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


    async getCardByTokenId(tokenId: number): Promise<Card> {
        const player = await request.get({
            uri: ' https://api-dot-cryptobaseball-b691f.appspot.com/playerId/' + tokenId  
        })

        let parsed: Card = JSON.parse(player).result

        return parsed 
    }

    async saveCard(card: Card) : Promise<void> {


        let existingPlayer: MlbPlayerInfo 


        if (card.mlbPlayerInfo) {
            existingPlayer = await this.getPlayer(card.mlbPlayerInfo.playerId)

            if (!existingPlayer) {
                existingPlayer = await this.savePlayer(card.mlbPlayerInfo)
            }
        }



        const result = await this.query(
            'INSERT INTO card (' +
                'visualString, uniformNumber, positionName, gameCardTeamID, teamName, positionId, attachments, ' + 
                'playerOverrideId, stance, isPromotional, isAttached, isPlaying, tokenId, generationSeason, creationTimestamp, ' + 
                'attachmentString, abilityString, earnedBy, gloveType, sequenceId, earnedByString, mlbPlayerId, teamId, ' + 
                'allAttributes, mlbGameId, type, batType, imagesUrl, status, position, lastName, firstName, playerId, debutDate, fullName, mlbTeamId, number ) ' +
            'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [
                card.visualString, 
                card.uniformNumber, 
                card.positionName,
                card.gameCardTeamID, 
                card.teamName, 
                card.positionId, 
                card.attachments, 
                card.playerOverrideId, 
                card.stance, 
                card.isPromotional, 
                card.isAttached, 
                card.isPlaying, 
                card.tokenID, 
                card.generationSeason, 
                card.creationTimestamp, 
                card.attachmentString, 
                card.abilityString, 
                card.earnedBy, 
                card.gloveType, 
                card.sequenceId, 
                card.earnedByString, 
                card.mlbPlayerId, 
                card.teamId, 
                card.allAttributes, 
                card.mlbGameId, card.type, 
                card.batType, 
                JSON.stringify(card.imagesURL),
                card.mlbPlayerInfo.status,
                card.mlbPlayerInfo.position,
                card.mlbPlayerInfo.lastName,
                card.mlbPlayerInfo.firstName,
                card.mlbPlayerInfo.playerId,
                card.mlbPlayerInfo.debutDate,
                card.mlbPlayerInfo.fullName,
                card.mlbPlayerInfo.mlbTeamId,
                card.mlbPlayerInfo.number 
            ]
        )


    }

    async savePlayer(player: MlbPlayerInfo) : Promise<MlbPlayerInfo> {
        
        if (!player || !player.playerId) return 

        const result = await this.query(
            'INSERT INTO player (status, position, lastName, firstName, playerId, debutDate, fullName, mlbTeamId, number) ' +
            'VALUES (?,?,?,?,?,?,?,?,?)',
            [
                player.status,
                player.position,
                player.lastName,
                player.firstName,
                player.playerId,
                player.debutDate,
                player.fullName,
                player.mlbTeamId,
                player.number
            ]
        )

        player.id = result.insertId


        return player

    }

    async getPlayer(playerId: Number) : Promise<MlbPlayerInfo> {

        const result = await this.query('SELECT * from player where playerId = ?', [playerId])

        if (result.length > 0) {
            return result[0]
        }

    }

}





export { PlayerService}