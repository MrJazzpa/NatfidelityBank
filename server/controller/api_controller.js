const Account_Model = require('../model/account_model');
const Balance_model = require('../model/account_Balance');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const account_Balance = require('../model/account_Balance');

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
            const get_balance = await account_Balance.findOne({ID:accountNumber})
            if(get_balance){
                const balance = Balance + parseFloat(get_balance.balance.replace(/,/g,""));
                const income  = Income + parseFloat(get_balance.income.replace(/,/g,""));
                const expenses = Expenses + parseFloat(get_balance.expenses.replace(/,/g,""));
                const totalbill = TotalBill + parseFloat(get_balance.totalbill.replace(/,/g,""));
                const savings= Savings + parseFloat(get_balance.savings.replace(/,/g,""));
                const saveupdate = await account_Balance.updateOne({ID:accountNumber},{balance:balance.toLocaleString('en-Us',{minimumFractionDigits:2}),income:income.toLocaleString('en-Us',{minimumFractionDigits:2}),expenses:expenses.toLocaleString('en-Us',{minimumFractionDigits:2}),totalbill:totalbill.toLocaleString('en-Us',{minimumFractionDigits:2}),savings:savings.toLocaleString('en-Us',{minimumFractionDigits:2})});
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
