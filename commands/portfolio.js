const Users = require('./handler/userHandling');
const API = require('./handler/stockApi');

module.exports={
    name: 'portfolio',
    description: 'portfolio get',
    execute(message, args, Discord, client)   {
        console.log("@portfolio: "+message.author.username + " " + args)
        var user = message.author.username;

        Users.getUser(user).then(
            (data)=>{
                var subject = data;
                var Quotes={};
                var printingString ="";
                var passingString = "";
                var skipTwo = 0;
                var none = false;

                for(var key in subject) {
                    skipTwo++;
                    if(skipTwo>2) {
                        if(subject[key].amount!=0){
                            printingString+=key+": "+subject[key].amount+"\n"
                            passingString+=key+",";
                        }
                    }
                }
                if(printingString==="") {printingString="No stocks.\n"; none = true;}
                //console.log(passingString)
                API.getQuote(passingString).then((data)=>{
                    var userDifference = 0.00;
                    var SUM = 0;
                    let embed = new Discord.MessageEmbed()
                        .setColor("#7289DA")
                        .setTitle("**"+subject.name+"**:")
                        .setDescription("**Balance:** " + currencyFormatDE(subject.balance)+"\n\n**Stocks:**\n```css\n"
                        +printingString+"```")
                    if(!none){
                        for (var key in data)   {
                            userDifference = (parseFloat(data[key].close)*subject[key].amount) - (parseFloat(subject[key].purchasedValue)*subject[key].amount);
                            SUM += parseFloat(subject[key].amount) * data[key].close;
                            if(userDifference>0) {
                                embed.addFields({name:"__"+key.toString()+"__",value:"**~~V:~~** `"+valueFormatDE(parseFloat(data[key].close))+"`\n**~~C:~~** `"+valueFormatDE(parseFloat(data[key].change))+"`\n**~~T:~~** `"+currencyFormatDE(parseFloat(subject[key].amount)*data[key].close)+"`\n"+toGreen(currencyFormatDE(userDifference)), inline:true});
                            } else if(userDifference<0) {
                                embed.addFields({name:"__"+key.toString()+"__",value:"**~~V:~~** `"+valueFormatDE(parseFloat(data[key].close))+"`\n**~~C:~~** `"+valueFormatDE(parseFloat(data[key].change))+"`\n**~~T:~~** `"+currencyFormatDE(parseFloat(subject[key].amount)*data[key].close)+"`\n"+toRed(currencyFormatDE(Math.abs(userDifference))), inline:true});
                            }else {
                                embed.addFields({name:"__"+key.toString()+"__",value:"**~~V:~~** `"+valueFormatDE(parseFloat(data[key].close))+"`\n**~~C:~~** `"+valueFormatDE(parseFloat(data[key].change))+"`\n**~~T:~~** `"+currencyFormatDE(parseFloat(subject[key].amount)*data[key].close)+"`\n"+toYellow(currencyFormatDE(userDifference)), inline:true});
                            }
                        }
                        embed.addFields(
                            {name:'\u200b', value:'\u200b'},
                            {name:"Total Value of Stocks:", value:currencyFormatDE(SUM), inline:true},
                            {name:"Net:", value:currencyFormatDE((SUM+subject.balance)-10000), inline:true}
                        );
                    }
                        message.channel.send(embed);



                })

   
            }
        ).catch(
            (error)=>{
                message.channel.send("You don't have a portfolio, type `!makeportfolio` to create one.");
                console.log(error)
                return
            }
        )
        
        function currencyFormatDE(num) {
            return (
              num
                .toFixed(2) // always two decimal digits
                .replace('.', '.') // replace decimal point character with ,
                .replace('$1.') + ' $'
            ) // use . as a separator
          }
          function valueFormatDE(num)   {
            return (
                num
                  .toFixed(5) // always two decimal digits
                  .replace('.', '.') // replace decimal point character with ,
                  .replace('$1.') + ' $'
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