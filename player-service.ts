import * as request from "request-promise-native";



class PlayerService {

    constructor(
        private contractInstance: any,
        private mysql: any
    ) {}

    async downloadAll(): Promise<void> {

        const self = this

        let keepGoing: boolean = true
        let counter: number = 0
    
        while(keepGoing) {
    
            try {
                let tokenId = await this.contractInstance.methods.tokenByIndex(counter).call()
                
                setTimeout(
                    async function () {
                        console.log(`Downloading card with tokenId: ${tokenId}`)
                        
                        let player = await self.getPlayerByTokenId(tokenId)

                        // console.log(player)
                        
                    }, 
                    1000
                )
    
                counter++
                
            } catch(ex) {
                console.log(ex)
                keepGoing = false
            }
    
        }
    }


    async getPlayerByTokenId(tokenId: number): Promise<any> {
        const player = await request.get({
            uri: ' https://api-dot-cryptobaseball-b691f.appspot.com/playerId/' + tokenId  
        })
        return JSON.parse(player).result
    }

    async savePlayer(player: any) : Promise<void> {
          
          this.mysql.query('INSERT INTO card SET ?', {title: 'test'}, function (error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
          });

    }


}

export { PlayerService}