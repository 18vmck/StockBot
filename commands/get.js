module.exports={
    name: 'get',
    description: 'stock testing with api response',
    execute(message, args, Discord, client)  {
        console.log("@get: "+message.author.username + " " + args)
        const { getQuote } = require('./handler/stockApi.js');
        if(args[0] == null) {
            message.channel.send("Please enter a company as `'!get COMP'`\nExamples: FB, AMZN, GOOGL, NFLX");
            return;
        }
        var symbol = args[0].toUpperCase();
        const computer = '💻';

        getQuote(symbol).then
        (
            (body)=>{ 
                if(body.name===undefined)   {
                    message.channel.send("That stock is unavailable.")
                    return
                }
                let embed = new Discord.MessageEmbed()
                .setColor("#1a73e8")
                .setTitle("**"+body.name+":** "+body.datetime)
                .setAuthor('StockAPI' + computer)
                .setDescription("Stock report for "+symbol)
                .addFields(
                    {name:'\u200b', value:'\u200b'},
                    {name:"Open:", value:currencyFormatDE(parseFloat(body.open)), inline:true},
                    {name:"Close:", value:currencyFormatDE(parseFloat(body.close)),inline:true},
                    {name:"Volume:", value:volumeFormatDE(parseFloat(body.volume)), inline:true},
                    {name:"High", value:currencyFormatDE(parseFloat(body.high)), inline:true},
                    {name:"Low", value:currencyFormatDE(parseFloat(body.low)), inline:true},
                    {name:"Change:", value:body.change, inline:true},
                    {name:'\u200b', value:'\u200b'},
                    
             
                )
                .setFooter(body.currency);
                message.channel.send(embed);
            }
            /*
            ```css
            "Here's some nice LIGHT GREEN colored text"
            ```
            */
        )

        function currencyFormatDE(num) {
            return (
              num
                .toFixed(5) // always two decimal digits
                .replace('.', '.') // replace decimal point character with ,
                .replace('$1.') + ' $'
            ) // use . as a separator
          }
          function volumeFormatDE(num) {
            return (
              num
                .toFixed(2) // always two decimal digits
                .replace('.', '.') // replace decimal point character with ,
                .replace('$1.')
            ) // use . as a separator
          }
    }
}