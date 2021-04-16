const Users = require('./handler/userHandling');
const API = require('./handler/stockApi');
const { Channel } = require('discord.js');

module.exports={
    name: 'embed',
    description: 'testing embeds',
    execute(message, args, Discord, client)   {
        const file = new Discord.MessageAttachment('./imgs/stonk.png');
        const exampleEmbed={
            title:'Embed',
            description: "This is an embed",
            color:"#7289DA",
            fields:[{name:"Toast",value:"BigToast",inline:true},{name:"toast2",value:"BigToast2",inline:true}],
            image:{
                url:'attachment://stonk.png'
            }
        }
        message.channel.send({files:[file], embed: exampleEmbed})
    }
}