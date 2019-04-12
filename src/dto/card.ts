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


    public imagesUrl: any 


    constructor(obj:any) {
        this.id = obj.id
        this.attributes = obj.attributes
        this.visualString  = obj.visualString
        this.uniformNumber  = obj.uniformNumber
        this.positionName = obj.positionName
        this.gameCardTeamID = obj.gameCardTeamID
        this.teamName = obj.teamName
        this.positionId = obj.positionId
        this.attachments = obj.attachments
        this.playerOverrideId = obj.playerOverrideId
        this.mlbPlayerInfo = obj.mlbPlayerInfo
        this.stance = obj.stance
        this.isPromotional = obj.isPromotional
        this.isAttached = obj.isAttached
        this.isPlaying = obj.isPlaying
        this.tokenID = obj.tokenID
        this.generationSeason = obj.generationSeason
        this.creationTimestamp = obj.creationTimestamp
        this.attachmentString = obj.attachmentString
        this.abilityString = obj.abilityString
        this.earnedBy = obj.earnedBy
        this.gloveType = obj.gloveType
        this.sequenceId = obj.sequenceId
        this.earnedByString = obj.earnedByString
        this.mlbPlayerId = obj.mlbPlayerId
        this.teamId = obj.teamId
        this.allAttributes = obj.allAttributes
        this.mlbGameId = obj.mlbGameId
        this.type = obj.type
        this.batType = obj.batType
        this.imagesUrl = obj.imagesUrl
    }





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
    public mlbTeamID: number  
    public number: number 
}


export {Card, MlbPlayerInfo}