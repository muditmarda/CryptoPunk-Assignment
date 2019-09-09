const CryptoPunkService = require("../services/CryptoPunkServices");

var appRouter = function (app) {
    const cryptoPunkService = new CryptoPunkService();

    app.get("/punks-for-sale", function(req, res) {
        cryptoPunkService.getPunksForSale()
          .then(result => {
            return res.status(200).send({ "punks_for_sale": result });
          })
          .catch(error => {
            console.log(error);
            return res.status(500).send(error);
          });
    });

    app.get("/punk-info/:punkIndex", function(req, res) {
        isValidRequest = cryptoPunkService.validatePunkIndex(req.params.punkIndex);
        if(!isValidRequest){
          var err = "Invalid punk index: " + req.params.punkIndex;
          return res.status(400).send({"error" : err});
        }
        cryptoPunkService.getPunkInfo(req.params.punkIndex)
          .then(result => {
            return res.status(200).send({ "punk_info": result });
          })
          .catch(error => {
            console.log(error);
            return res.status(500).send(error);
          });
    });
}
  
module.exports = appRouter;