module.exports = {
    name: 'view',
    description: 'another help function',
    execute(message, args, Discord, client)   {
        const symbol = '⏹️';
        let embed = new Discord.MessageEmbed()
        .setColor("#1a73e8")
        .setTitle("Popular Stocks:")
        .setAuthor('StockBot' + symbol)
        .setDescription("A list of common stocks.")
        .addFields(
            {name:"Commons", value:"`TSLA` - Tesla\n`GME` - Gamestop\n`AMZN` - Amazon\n`GOOGL` - Google\n`FB` - FaceBook\n`NFLX` - Netflix\n"}
        )
     
        message.channel.send(embed);
    }
}