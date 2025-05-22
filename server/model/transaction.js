const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
   ID:{
      type:String,
      require:true
   },
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
   },
     amount:{
        type:String,
        require:true
     },
      transaction_type:{
        type:String,
        require:true
     },
     transactionid:{
      type:String,
      require:true
     },
     date:{
        type: String, // Store as a formatted string
         require:true
       }
})

module.exports = mongoose.model('Transaction',TransactionSchema)