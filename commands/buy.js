const Users = require('./handler/userHandling');
const API = require('./handler/stockApi');
module.exports = {
    name: 'buy',
    description: 'Buying functionality',
    async execute(message, args, Discord, client)   {
        console.log("@buy: "+message.author.username + " " + args)
        //const channel = '830936886473261066';
        /*
        if(message.channel!=channel)    {
            message.channel.send("Please move to the correct channel to Buy and Sell.");
            return
        }*/ 
         if (args[0]==null||args[1]==null)    {
            message.channel.send("Please enter a valid command.");
            return
        }
        if(args[0]=="all") var buyingAll = true;
        else {
            var amount = parseInt(args[0])
            if(amount < 0)  {
                message.channel.send("Please enter a valid amount.");
                return;
            }
        }
        var symbol = args[1].toUpperCase()
        var user = message.author.username

        const checkmark = '✅';
        const xmark = '❌';
        const icon = '🟦';


        Users.getUser(user).then(
            (data)=>{
                var subject = data;
                API.getQuote(symbol).then(
                    async (response)=>{
                        var tempBalance = subject.balance
                        var max = 0;
                        var value = parseFloat(response.close)
                        while(tempBalance>value)    {
                            tempBalance-=value;
                            max++;
                        }
                        if(max==0) {

                        }
                        if(buyingAll) amount = max;
                        var clicked = false;
                        

                        if(response.name==undefined)    {
                            message.channel.send("That stock is unavailable.");
                            return
                        }
                        var price = amount * value;
                        var remBalance = subject.balance - price
                         // Calculating the most a person can buy.
                        let embed = new Discord.MessageEmbed()
                        .setColor("#2ab0ff")
                        .setTitle("**"+subject.name+"**:\nBuying "+amount+" of "+response.name)
                        .setDescription(symbol +" Market Values:")
                        .addFields(
                            {name:"Valued at:", value:currencyFormatDE(parseFloat(response.close)), inline:true},
                            {name:"Recent change:", value:volumeFormatDE(parseFloat(response.change)), inline:true},
                            {name:"_", value:"**Price:** " + currencyFormatDE(price)
                            +"\n\n**Current Balance:** " + currencyFormatDE(subject.balance)
                            +"\n**Remaining Balance:** "+currencyFormatDE(remBalance)
                            },
                            {name:"Most you can buy:", value:max},
                        )
                        let messageEmbed = await message.channel.send(embed);
                        messageEmbed.react(checkmark);
                        messageEmbed.react(xmark);
                    
                        if(amount==0)   {
                            message.channel.send("You just can't afford any . . .");
                            return;
                        }

                        client.on('messageReactionAdd', async (reaction, user)=>{
                            if(reaction.message.partial) await reaction.message.fetch();
                            if(reaction.partial) await reaction.fetch();
                            if(user.bot) return;
                            if(!reaction.message.guild) return;
                
                            if(true)    {
                                if(!clicked) {
                                    if(reaction.emoji.name===checkmark && user.id==message.author.id)   {
                                        if(remBalance>0) {
                                            subject.balance = remBalance
                                            if(subject[symbol]==null) {
                                                subject[symbol]={
                                                    amount: amount,
                                                    purchasedValue: parseFloat(response.close)
                                                }
                                            }
                                            else {
                                                subject[symbol].amount+=amount;
                                                subject[symbol].purchasedValue=parseFloat(response.close);
                                            }
                                            message.channel.send("**PURCHASED:** `"+amount+" "+symbol+'`');
                                            Users.setUser(subject);
                                            clicked = true;
                                            return;
                                        }
                                        else {
                                            message.channel.send("You do not have that money . . .");
                                            Users.setUser(subject);
                                            clicked = true;
                                            return
                                        }
                                    }
                                    if(reaction.emoji.name===xmark && user.id==message.author.id) {
                                        clicked = true;
                                        message.channel.send("**CANCELLED ORDER**");
                                        return;
                                    }
                                } else {
                                    return
                                }
                                
                            }  
                            else return;
                
                        })
                    })
        }).catch((error)=>{
            message.channel.send("You don't seem to have a portfolio.");
        })
        function currencyFormatDE(num) {
            return (
              num
                .toFixed(2) // always two decimal digits
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