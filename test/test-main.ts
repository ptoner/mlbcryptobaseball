import assert = require('assert')
import { isMainThread } from 'worker_threads'
import { FileService } from '../src/file_service';
import { PlayerService } from '../src/player-service';
import { CardService } from '../src/card-service';
const util = require('util');

var Web3 = require("web3")
var fs = require('fs')
const path = require("path")

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/fbc80c62bd7d4e61b0c4b5654d226d87'))


var parsedAbi = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../src/contract.json")))
var mlbContractAddress = '0x8c9b261Faef3b3C2e64ab5E58e04615F8c788099'
var contractInstance = new web3.eth.Contract(parsedAbi,mlbContractAddress)

var mysqlConnection = createMySqlConnection()
var mysqlQuery = util.promisify(mysqlConnection.query).bind(mysqlConnection)

const ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({
    host: "localhost",
    port: 5001,
    protocol: 'http'
  })

//@ts-ignore
contract('Process Tests', async (accounts) => {

    let fileService: FileService = new FileService(ipfs)
    let cardService: CardService = new CardService(mysqlQuery)
    let playerService: PlayerService = new PlayerService(contractInstance,ipfs, fileService, cardService)

    
    //@ts-ignore
    beforeEach('Setup', async () => {
    })


    //@ts-ignore
    it("Test processAll", async () => {

        //Act
        await playerService.processAll()

        // console.log(await playerService.getCard(1))

    })

})






function createMySqlConnection() {
    /** mysql */
    var mysql      = require('mysql');
    var mysqlConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'admin',
    password : 'password',
    })

    mysqlConnection.connect(function(err) {
    // connected! (unless `err` is set)
    })

    mysqlConnection.query('USE mlbcryptobaseball', function(err) {
        if (err) throw err;
    
        console.log('Query Successful');
    })

    return mysqlConnection
}