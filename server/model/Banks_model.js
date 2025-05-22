const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const BankSchema = new Schema({
    account_number:{
         type:String,
         require:true
    },
    account_name:{
        type:String,
        require:true
   },
   bank_name:{
    type:String,
    require:true
}
})

module.exports = mongoose.model("Banks",BankSchema);