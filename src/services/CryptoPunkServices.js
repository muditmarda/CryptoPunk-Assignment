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
        const isValidRequest = this.validatePunkIndex(punkIndex);
        if(!isValidRequest){
            throw("Invalid punk index: '" + punkIndex + "'");
        }
        let res = this.getPunkDetails(punkIndex);
        if(!res){
            throw("Invalid punk index: '" + punkIndex + "'");
        }
        res.punkIndex = punkIndex;
        var fetchedPunkBids = await contract.methods.punkBids(punkIndex).call();
        var fetchedPunkOffer = await contract.methods.punksOfferedForSale(punkIndex).call();
        res.isForSale = fetchedPunkOffer.isForSale;
        var highestBidValue = parseInt(fetchedPunkBids.value);
        
        // The punk's price is the highest bid value, or the minimum value specified by seller in case of no bids
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
    
    // Gets Punk's details from CryptoPunks.json
    getPunkDetails(punkIndex){
        const punkIndexStr = "" + punkIndex;
        return CryproPunkDetails[punkIndexStr];
    }
    
    async updatePunksForSale(){
        // Getting all past events about punks offered for sale
        var punksOfferedLogs = await contract.getPastEvents('PunkOffered', {
          fromBlock: Config.STARTBLOCK,
          toBlock: 'latest'
        });
    
        var PunksForSale = new Set();
        for(let i = 0; i < punksOfferedLogs.length; i++){
            PunksForSale.add(punksOfferedLogs[i].returnValues.punkIndex)
        }

        // Getting all past events when punks are no longer for sale
        var punksNoLongerForSaleLogs = await contract.getPastEvents('PunkNoLongerForSale', {
            fromBlock: Config.STARTBLOCK,
            toBlock: 'latest'
        });
    
        // The difference between the punks offered for sale and the punks no longer for sale 
        // will give the punks currently available for sale 
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

    validatePunkIndex(punkIndex){
        if(isNaN(punkIndex) || punkIndex < 1 || punkIndex > 9000 || punkIndex%1000 == 0){
            return false;
        }
        return true;
    }
}

module.exports = CryptoPunkService;
  