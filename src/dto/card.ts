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
    public mlbTeamID: number  
    public number: number 
}


export {Card, MlbPlayerInfo}