const Users = require('./handler/userHandling');
const API = require('./handler/stockApi');
module.exports = {
    name: 'sell',
    description: 'Selling functionality',
    async execute(message, args, Discord, client)   {
        console.log("@sell: "+message.author.username + " " + args)
        //const channel = '830936886473261066'; // TODO:Remove channel lock
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
        const icon = '🟩';

        Users.getUser(user).then(
            (data)=>{
                var subject = data;
                var currentStock = subject[symbol].amount
                if (currentStock==undefined)    {
                    message.channel.send("You don't have any of that stock.")
                    return;
                }
                if (currentStock < amount)  {
                    message.channel.send("You don't have that much. \nYou have `"+currentStock+" "+symbol+"` available.");
                    return
                }
                API.getQuote(symbol).then(
                    async (body)=>{
                        var clicked = false;
                        response = body;
                        if(response.name==undefined)    {
                            message.channel.send("That stock is unavailable.");
                            return
                        }
                        if(buyingAll) amount = subject[symbol].amount;
                        var price = amount * parseFloat(response.close);
                        var remBalance = subject.balance + price
                        var userDifference = 0.00
                        userDifference=(parseFloat(response.close)*amount) - (parseFloat(subject[symbol].purchasedValue)*amount);

                        let embed = new Discord.MessageEmbed()
                        .setTitle("**"+subject.name+"**: Selling "+amount+" of "+response.name)
                        .setDescription("**"+symbol+" Value:** " + currencyFormatDE(price)
                                        +"\n\n**Current Balance:** " + currencyFormatDE(subject.balance)
                                        +"\n**Balance after sale:** "+currencyFormatDE(remBalance)
                                        )
                        .addFields(
                            {name:"Valued at:", value:currencyFormatDE(parseFloat(response.close)), inline:true},
                            {name:"Recent change:", value:volumeFormatDE(parseFloat(response.change)), inline:true}
                        )
                        if(userDifference>0) {
                            embed.addFields({name:"Loss/Gain:",value:toGreen(currencyFormat5Point(userDifference))    })
                            .setColor("#34a853")
                        }else if(userDifference<0){
                            embed.addFields({name:"Loss/Gain:",value:toRed(currencyFormat5Point(Math.abs(userDifference)))})
                            .setColor("#B22222")
                        }else {
                            embed.addFields({name:"Loss/Gain:",value:toYellow(currencyFormat5Point(userDifference))   })
                            .setColor("#FFA500")
                        }
                        let messageEmbed = await message.channel.send(embed);
                        messageEmbed.react(checkmark);
                        messageEmbed.react(xmark);

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
                                                console.log("Error, selling none stock:returning");
                                                return;
                                            }else
                                                subject[symbol].amount-=amount;
                                            message.channel.send("**SOLD:** `"+amount+" "+symbol+'`');
                                            Users.setUser(subject);
                                            clicked = true;
                                            return;
                                        }
                                        else {
                                            message.channel.send("You are broke . . .");
                                            Users.setUser(subject);
                                            clicked = true;
                                            return
                                        }
                                    }
                                    if(reaction.emoji.name===xmark && user.id==message.author.id) {
                                        message.channel.send("**CANCELLED ORDER**");
                                        clicked = true;
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
          function currencyFormat5Point(num) {
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
        function toGreen(string) {
                return "```diff\n+"+string+"\n```"
            }
        function toYellow(string)    {
            return "```fix\n"+string+"\n```"
        }
        function toRed(string)   {
            return "```diff\n-"+string+"\n```"
        }
    }
}