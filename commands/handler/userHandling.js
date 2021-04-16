const fs = require('fs');
module.exports={
    getUser(userName){
        console.log("--- ^ getUser("+userName+")")
        return new Promise((resolve, reject)=>{
            fs.readFile('./users/'+userName+'.json', 'utf-8', (err,data)=> {
                if(err) return reject(err);
                data = JSON.parse(data.toString());
                return resolve(data);
             })
        });
    },
    setUser(user){
        console.log("--- ^ setUser("+user.name+")")
        data = JSON.stringify(user);
        fs.writeFile('./users/'+user.name+'.json', data, (err)=>  {
            if (err) throw err;
            console.log(user.name+" JSON data saved.");
        })
    },
    currencyFormatDE(num) {
        return (
          num
            .toFixed(2) // always two decimal digits
            .replace('.', '.') // replace decimal point character with ,
            .replace('$1.') + ' $'
        ) // use . as a separator
      }

}