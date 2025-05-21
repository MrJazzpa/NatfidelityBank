const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BalanceSchema = new Schema({
    ID:{
        type:String,
        required:true
        
    },
    balance:{
        type:String,
       default:"0"
    },
    income:{
        type:String,
       default:"0"
    } ,
    expenses:{
        type:String,
       default:"0"
    },
    totalbill:{
        type:String,
       default:"0"
    },
    savings:{
        type:String,
       default:"0"
    }

})

module.exports= mongoose.model('AccountBalance',BalanceSchema)