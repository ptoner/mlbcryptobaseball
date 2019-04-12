import { PlayerService} from "./player-service"
import { FileService } from "./file_service";
import { CardService } from "./card-service";
const util = require('util');


/** Web3 */
var Web3 = require("web3")
var fs = require('fs')

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/fbc80c62bd7d4e61b0c4b5654d226d87'))

var parsedAbi = JSON.parse(fs.readFileSync("contract.json"))
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


  let fileService: FileService = new FileService(ipfs)
  let cardService: CardService = new CardService(mysqlQuery)
  let playerService: PlayerService = new PlayerService(contractInstance,ipfs, fileService, cardService)


async function run() {
    await playerService.downloadAll(125000, 165000)
}


run()






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
        })

    return mysqlConnection
}