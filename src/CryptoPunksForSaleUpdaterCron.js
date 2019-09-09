const Cron = require("cron");
const CryptoPunkService = require("./services/CryptoPunkServices");
const cryptoPunkService = new CryptoPunkService();

function updatePunksForSaleCronJob() {
    // Run CronJob to update punks for sale every minute
    new Cron.CronJob("* * * * *", function() { cryptoPunkService.updatePunksForSale() }, null, true, "America/Los_Angeles");
}

module.exports = { updatePunksForSaleCronJob };