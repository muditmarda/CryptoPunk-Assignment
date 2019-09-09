const Cron = require("cron");
const CryptoPunkService = require("./services/CryptoPunkServices");
const cryptoPunkService = new CryptoPunkService();

function updatePunksForSaleCronJob() {
    // Run CronJob Every Minute
    new Cron.CronJob("* * * * *", function() { cryptoPunkService.updatePunksForSale() }, null, true, "America/Los_Angeles");
}

module.exports = { updatePunksForSaleCronJob };