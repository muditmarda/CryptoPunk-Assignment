const Web3 = require("web3");
const Config = require("../Config");
const CryptoPunksMarketAbi = require("../contracts/CryptoPunksMarket.abi");
const CryproPunkDetails = require("../contracts/CryptoPunks.json");
const web3 = new Web3(new Web3.providers.HttpProvider(Config.NETWORK));
const contract = new web3.eth.Contract(CryptoPunksMarketAbi, Config.CONTRACT);
var punksForSale = []; 
var hasStarted = false;

class CryptoPunkService {

    async getPunkInfo(punkIndex){
        let res = this.getPunkDetails(punkIndex);
        if(!res){
            throw("No punk found for the provided index");
        }
        res.punkIndex = punkIndex;
        var fetchedPunkBids = await contract.methods.punkBids(punkIndex).call();
        var fetchedPunkOffer = await contract.methods.punksOfferedForSale(punkIndex).call();
        res.isForSale = fetchedPunkOffer.isForSale;
        var highestBidValue = parseInt(fetchedPunkBids.value);
        if (!highestBidValue){
            res.price = fetchedPunkOffer.minValue + " wei";
        } else {
            res.price =  highestBidValue + " wei";
        }
        return res;
    }
    
    async getPunksForSale(){
        return punksForSale;
    }
    
    getPunkDetails(punkIndex){
        const punkIndexStr = "" + punkIndex;
        return CryproPunkDetails[punkIndexStr];
    }
    
    async updatePunksForSale(){
        var punksOfferedLogs = await contract.getPastEvents('PunkOffered', {
          fromBlock: Config.STARTBLOCK,
          toBlock: 'latest'
        });
    
        var PunksForSale = new Set();
        for(let i = 0; i < punksOfferedLogs.length; i++){
            PunksForSale.add(punksOfferedLogs[i].returnValues.punkIndex)
        }
    
        var punksNoLongerForSaleLogs = await contract.getPastEvents('PunkNoLongerForSale', {
            fromBlock: Config.STARTBLOCK,
            toBlock: 'latest'
        });
    
        for(let i = 0; i < punksNoLongerForSaleLogs.length; i++){
            if(PunksForSale.has(punksNoLongerForSaleLogs[i].returnValues.punkIndex)){
                PunksForSale.delete(punksNoLongerForSaleLogs[i].returnValues.punkIndex)
            }
        }
    
        var punksForSaleArr = [];
    
        PunksForSale.forEach(element => {
            punksForSaleArr.push(parseInt(element));
        });
    
        punksForSale = punksForSaleArr;
    
        if(!hasStarted){
          console.log("################################################");
          console.log("  API Server started, Listening on port: ", Config.PORT);
          console.log("################################################");
          hasStarted = true;
        }
    }
}

module.exports = CryptoPunkService;
  