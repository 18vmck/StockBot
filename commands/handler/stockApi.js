module.exports = {
     getQuote(arg) {
        console.log("--- ^ getQuote("+arg+")")
         return new Promise((resolve, reject)=>{
            var unirest = require("unirest");
            var req = unirest("GET", "https://twelve-data1.p.rapidapi.com/quote");
            req.query({
                "symbol": arg,
                "interval": "1day",
                "format": "json",
                "outputsize": "30"
            });
            req.headers({
                "x-rapidapi-key": "0e779e8774msh1c8597533403bdap11285fjsn86685db0dc3f",
                "x-rapidapi-host": "twelve-data1.p.rapidapi.com",
                "useQueryString": true
            });
            req.end(function (response){
                if (response.error) return reject(response.error);
                else return resolve(response.body);
            })
         });
    },
    getPrices(string) {
        console.log("--- ^ getPrices("+string+")")
        return new Promise((resolve,reject)=>{
            var unirest = require("unirest");
            var req = unirest("GET", "https://twelve-data1.p.rapidapi.com/price");
            req.query({
                "symbol":string,
                "outputsize": "30",
                "format": "json"
            });
            req.headers({
                "x-rapidapi-key": "0e779e8774msh1c8597533403bdap11285fjsn86685db0dc3f",
                "x-rapidapi-host": "twelve-data1.p.rapidapi.com",
                "useQueryString": true
            });
            req.end(function (response){
                if (response.error) return reject(response.error);
                else return resolve(response.body);
            })
        })
    }
}
