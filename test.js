const Users = require('./commands/handler/userHandling.js');
const API = require('./commands/handler/stockApi');
var amount = 10;
arg = "WORK, AMZN,"

Users.getUser("Volyak").then((user)=>{
    API.getQuote(arg).then(
        (body)=>{
            data=body;
            console.log(data)
            var price = amount * data.close
            var remBalance = user.balance - price
            console.log("You want to buy " + amount +" stock of "+arg);
            console.log("This will cost " + currencyFormatDE(price));
            console.log("You will have " + currencyFormatDE(remBalance) +" left over");
            user.balance=remBalance;
            //Users.setUser(user); // save the user at the end of the function
        }
    )
})

function currencyFormatDE(num) {
    return (
      num
        .toFixed(2) // always two decimal digits
        .replace('.', '.') // replace decimal point character with ,
        .replace('$1.') + ' $'
    ) // use . as a separator
  }