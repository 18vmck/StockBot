module.exports = {
    name: 'stockhelp',
    description: 'help function',
    execute(message, args, Discord, client)   {
        const symbol = '⏹️';
        let embed = new Discord.MessageEmbed()
        .setColor("#1a73e8")
        .setTitle("Command List:")
        .setAuthor('StockBot' + symbol)
        .setDescription("A list of useful commands.")
        .addFields(
            {name:'\u200b', value:'\u200b'},
            {name:"`-get [SYM]`", value:"Get the current stock information for a symbol."},
            {name:"`-makeportfolio`", value:"Initializes a users portfolio."},
            {name:"`-portfolio` / `-p`", value:"View your portfolio."},
            {name:"`-buy [AMOUNT] [SYM]`", value:"Buy an amount of stock of the symbol entered."},
            {name:"`-sell [AMOUNT] [SYM]`", value:"Sell an amount of stock of the symbol entered."},
            {name:"`-view`", value:"See the symbols of some potential stocks to buy."},
            {name:"`-stockhelp`", value:"You are here."},
            {name:'\u200b', value:'\u200b'},
        )
     
        message.channel.send(embed);
    }
}