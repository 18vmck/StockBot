const Users = require('./handler/userHandling');
module.exports={
    name: 'makeportfolio',
    description: 'make the portfolio for the users',
    execute(message, args)  {
        console.log("@makeportfolio: "+message.author.username + " " + args)
        const newUser = {
            name: message.author.username,
            balance: 10000
        }
        Users.getUser(newUser.name).then(
            (data)=>{
                message.channel.send("You already have a portfolio.")
                return;
            }
        ).catch(
            (reject)=>{
                console.log("No file found.");
                Users.setUser(newUser);
                message.channel.send("Created a fresh portfolio for "+newUser.name);
                return;
        })
    }
}