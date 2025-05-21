const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const AccountSchema = new Schema({
    account_number:{
        type:String,
        require:true
    },
    account_name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
 })

 module.exports = mongoose.model('Account',AccountSchema);