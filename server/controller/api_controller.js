const Account_Model = require('../model/account_model');
const Balance_model = require('../model/account_Balance');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bank_model = require('../model/Banks_model');
const Trans_model = require('../model/transaction');

function getRandom10DigitNumber() {
    const min = 1000000000; // Smallest 10-digit number
    const max = 9999999999; // Largest 10-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
exports.createAcount= async(req,res)=>{
   const AccountNumber = getRandom10DigitNumber();
   const  AccountName = req.body.AccountName;
   //const  Balance = parseFloat(req.body.Balance)
   const Password = req.body.Password
   if(AccountName=="" || Password==""){
       res.status(500).json({empty_input:"Fields cannot be empty"})
   }else{
      const salt = await bcrypt.genSalt(15);
        const hashedpassword = await bcrypt.hash(Password,salt);
         const  result= await Account_Model.create({account_number:AccountNumber,account_name:AccountName,password:hashedpassword})
          try{
            if(result){
               const save_balance = await Balance_model.create({ID:AccountNumber})
               res.json({sucess:"Account has been Created",data:result})
              }else{
                res.json({sucess:"Unable to create accoount"})
              }
              
          }catch(err){
            res.status(500).json({error:err.message})
          }
        
        
   }
   
}

exports.login = async(req,res)=>{
    const acctNumber = req.body.AccountNumber;
    const password = req.body.Password;
     if(acctNumber == "" || password == ""){
        res.json({error:"Inputs are empty please fill them"})
     }else{
        try{
            const getuser = await Account_Model.findOne({account_number:acctNumber});
            if(!getuser){
                console.log('user not found')
                return res.json({error:"User not found",status:403});
            }else{
                const isMatch = await bcrypt.compare(password,getuser.password);
                if(!isMatch){
                    return res.json({error:"Invalid Credentials",status:403});
                }else{
                    
                    const token = jwt.sign({id:getuser._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"});
                    res.cookie("jwt",token,{httpOnly:true,maxAge:36000000});
                    
                    return res.json({token:token,status:200})
                }
            }
        }catch(err){
            console.error(err.message)
            return res.status(400).json({error:err.message})
        }
     }
}

exports.updateBalance = async(req,res)=>{
    const accountNumber= req.body.ID;
    const Balance = parseFloat(req.body.Balance);
    const Income =  parseFloat(req.body.Income);
    const Expenses = parseFloat(req.body.Expenses)
    const TotalBill =  parseFloat(req.body.TotalBill);
    const Savings = parseFloat(req.body.Savings)
      if(accountNumber=="" || Balance == "" || Income=="" || Expenses ==""){
         res.json({error:"Input fields must be filled"})
      }else{
        try{
            const get_balance = await Balance_model.findOne({ID:accountNumber})
            if(get_balance){
                const balance = Balance + parseFloat(get_balance.balance.replace(/,/g,""));
                const income  = Income + parseFloat(get_balance.income.replace(/,/g,""));
                const expenses = Expenses + parseFloat(get_balance.expenses.replace(/,/g,""));
                const totalbill = TotalBill + parseFloat(get_balance.totalbill.replace(/,/g,""));
                const savings= Savings + parseFloat(get_balance.savings.replace(/,/g,""));
                const saveupdate = await Balance_model.updateOne({ID:accountNumber},{balance:balance.toLocaleString('en-Us',{minimumFractionDigits:2}),income:income.toLocaleString('en-Us',{minimumFractionDigits:2}),expenses:expenses.toLocaleString('en-Us',{minimumFractionDigits:2}),totalbill:totalbill.toLocaleString('en-Us',{minimumFractionDigits:2}),savings:savings.toLocaleString('en-Us',{minimumFractionDigits:2})});
                if(saveupdate){
                    res.json({data:"Account has been updated"});
                }else{
                        res.json({error:"Could not update Account"})
                }
              //  console.log(balance.toLocaleString('en-Us',{minimumFractionDigits:2}))
        
               
            }else{
                res.json({error:"Account not found"})
            }
         }catch(error){
            console.error(error.message);
             res.json({error:error.message});
         }
        
      }
    
 }

 exports.uploadBank = async(req,res)=>{ 
      
     const acctnum = req.body.AccountNumber;
     const acctname = req.body.AccountName;
     const bank = req.body.Bank;
     if(acctnum =="" && acctname == "" && bank == ""){
         return res.status(500).json({error:"Inputs cannot be empty"});
     }else{
        try{
            const  saveBank = await bank_model.create({account_number:acctnum,account_name:acctname,bank_name:bank});
            if(saveBank){
                return  res.json({success:"Bank Saved"})
            }else{
                return res.json({error:"Unable to save bank"})
            }
        }catch(err){
             console.error(err.message);
            return res.json({error:err.message});
        }
     }

      
 }

 exports.getbank = async(req,res)=>{
      await bank_model.find()
      .then(result=>{
          res.json({data:result});
      }).catch(error=>{
          console.error(error.message)
          res.status(500).json({error:error.message});
      })
 }
 exports.getname = async(req,res)=>{
    await bank_model.findOne({account_number:req.params.account_number},{account_name:1})
    .then(result=>{
        res.json({data:result});
    }).catch(error=>{
        console.error(error.message)
        res.status(500).json({error:error.message});
    })
 }

 exports.transaction= async(req,res)=>{
      let userid = req.body.userid;
      let account_number = req.body.AccountNumber;
      let account_name = req.body.AccountName;
      let bank_name = req.body.BankName;
      let transid = req.body.Transid;
      let Amount = parseFloat(req.body.Amount.replace(/,/g,""));
      let trans_date = req.body.trans_date
      let transaction_type="debit";
       let final_balance =0;
     try{
      
            let get_balance = await Balance_model.findOne({ID:userid});
            let balance = parseFloat(get_balance.balance.replace(/,/g,""));
             if(Amount>balance){
                res.json({error:"Insufficient Balance",status:500});
             }else{

                final_balance = balance - Amount;
                let update_balance = await Balance_model.updateOne({ID:userid},{balance:final_balance.toLocaleString('en-Us',{minimumFractionDigits:2})})
                if(update_balance){
                    let Trans_history = await Trans_model.create({ID:userid,account_number:account_number,account_name:account_name,bank_name:bank_name,amount:Amount.toLocaleString('en-Us',{maximumFractionDigits:2}),transaction_type:transaction_type,transactionid:transid,date:trans_date})
                    if(Trans_history){
                        return res.json({data:"Successfull",status:200});
                    }
                }else{
                    console.log("Balance could not be updated");
                     return res.json({error:"Balance could not be updated"})
                }
             }
     }catch(err){
        console.error(err.message);
        return res.status(500).json({error:err.message});
     }
 }
 function generateRandomAlphanumeric(length) {
    const chars = 'ABCDEFGHIJK0123456789LMNOPQRSTUVWXYZa0123456789bcdefghijkl';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randIndex = Math.floor(Math.random() * chars.length);
      result += chars[randIndex];
    }
    return result;
  }
  function formatDateTime() {
    const date = new Date();
  
    // Format options
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
  
    return date.toLocaleString('en-US', options);
  }
 exports.admin_transaction= async(req,res)=>{
    let userid = req.body.userid;
    let SenderAccountNumber = req.body.SenderAccountNumber;
    let account_name = req.body.AccountName;
    let bank_name = req.body.BankName;
    let transid = generateRandomAlphanumeric(25);
    let Amount = parseFloat(req.body.Amount.replace(/,/g,""));
    let trans_date = formatDateTime();
    let transaction_type="credit";
     let final_balance =0;
   try{
    
          let get_balance = await Balance_model.findOne({ID:userid});
          let balance = parseFloat(get_balance.balance.replace(/,/g,""));
          
          final_balance = balance + Amount;
          let update_balance = await Balance_model.updateOne({ID:userid},{balance:final_balance.toLocaleString('en-Us',{minimumFractionDigits:2})})
          if(update_balance){
              let Trans_history = await Trans_model.create({ID:userid,account_number:SenderAccountNumber,account_name:account_name,bank_name:bank_name,amount:Amount.toLocaleString('en-Us',{maximumFractionDigits:2}),transaction_type:transaction_type,transactionid:transid,date:trans_date})
              if(Trans_history){
                  return res.json({data:"Successfull",status:200});
              }
          }else{
              console.log("Balance could not be updated");
                return res.json({error:"Balance could not be updated"})
          }
   }catch(err){
      console.error(err.message);
      return res.status(500).json({error:err.message});
   } 
}
    
