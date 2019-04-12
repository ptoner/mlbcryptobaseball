import { Card } from "./dto/card";

class CardService {

    constructor( 
        private query: any,
    ) {}

    async deleteCard(tokenId: Card) : Promise<void> {

        // console.log(`Deleting token #${tokenId}`)
        await this.query("DELETE FROM card WHERE tokenId = ? ", [tokenId])

    }

    async saveCard(card: Card) : Promise<void> {

        // console.log(`Saving token #${card.tokenID}`)

        this.printCardInfo(card, "Saving")

        const result = await this.query(
            'INSERT INTO card (' +
                'visualString, uniformNumber, positionName, gameCardTeamID, teamName, positionId, attachments, ' + 
                'playerOverrideId, stance, isPromotional, isAttached, isPlaying, tokenId, generationSeason, creationTimestamp, ' + 
                'attachmentString, abilityString, earnedBy, gloveType, sequenceId, earnedByString, mlbPlayerId, teamId, ' + 
                'allAttributes, mlbGameId, type, batType, imagesUrl, status, position, lastName, firstName, playerId, debutDate, fullName, mlbTeamId, number ) ' +
            'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
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
                JSON.stringify(card.imagesUrl),
                card.mlbPlayerInfo.status,
                card.mlbPlayerInfo.position,
                card.mlbPlayerInfo.lastName,
                card.mlbPlayerInfo.firstName,
                card.mlbPlayerInfo.playerId,
                card.mlbPlayerInfo.debutDate,
                card.mlbPlayerInfo.fullName,
                card.mlbPlayerInfo.mlbTeamID,
                card.mlbPlayerInfo.number 
            ]
        )


    }

    async getCard(tokenId: number) : Promise<Card> {

        const result = await this.query("select * from card where tokenId = ?", [tokenId])

        let record:any
        

        if (result.length > 0) {
            record = result[0]
        }

        if (record.imagesURL) {
            record.imagesUrl = JSON.parse(record.imagesURL)
        }
        
        if (record.imagesUrl) {
            record.imagesUrl = JSON.parse(record.imagesUrl)
        }
        

        return new Card(record)

    }



    async printCardInfo(card: Card, action: string ) : Promise<void> {

        let playerName 
        let teamName

        if (card.mlbPlayerInfo) {
            playerName = card.mlbPlayerInfo.firstName + " " + card.mlbPlayerInfo.lastName
            teamName = card.teamName
        }

        console.log(`${action} - Token #${card.tokenID}: ${card.generationSeason} / ${playerName} / ${teamName} / ${card.type}`)

    }

}

export { CardService }