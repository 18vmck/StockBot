const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const Chalk = require('chalk')
const fs = require('fs');

process.setMaxListeners(3);

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file=>file.endsWith('.js'))
for(const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}
// DISCORD COLOURS  //
/*
```css
"Here's some nice LIGHT GREEN colored text"
```
*/
/*
```diff
-Here's some nice RED colored text-
```
*/

const prefix = '!';

client.once('ready', () => {
    console.log(Chalk.yellowBright('StockBot is online!'))
});

client.on('message', message =>{
    if(!message.content.startsWith(prefix)||message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'get')
        client.commands.get('get').execute(message,args,Discord,client);
    else if(command ==='makeportfolio') 
        client.commands.get('makeportfolio').execute(message,args);
    else if (command === 'portfolio' || command ==='p')  
        client.commands.get('portfolio').execute(message,args,Discord,client);
    else if(command === 'buy')
        client.commands.get('buy').execute(message,args,Discord,client);
    else if(command === 'sell')
        client.commands.get('sell').execute(message,args,Discord,client);
    else if(command ==='stockhelp')
        client.commands.get('stockhelp').execute(message, args, Discord, client);
    else if(command ==='view')
        client.commands.get('view').execute(message,args, Discord, client);
    else if(command ==='embed')
        client.commands.get('embed').execute(message,args, Discord, client);

});

// Last line
client.login("ODMwNTQwNTEwMTc4OTY3NTUz.YHILIA.8UbDFJSE7LM3Qt9LLMaO3DHZrsM");
// Last line