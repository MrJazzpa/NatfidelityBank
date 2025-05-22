 const Account_Model = require('../model/account_model');
 const Balance_Model = require('../model/account_Balance');
 const transaction_model = require('../model/transaction');
exports.login = async(req,res)=>{
    locals={
        title:"Authentication"
   }
  res.render('pages/app-login',{locals})
}
exports.userDashboard = async(req,res)=>{
     locals={
          title:"Home"
     }
     const id = req.user.id
     try{
         const getuser = await Account_Model.findOne({_id:id})
         if(getuser){
            const get_balance = await Balance_Model.findOne({ID:getuser.account_number})
            const transDetail = await transaction_model.find({ID:getuser.account_number});
            console.log(transDetail);
            res.render('pages/index',{locals,getuser,get_balance,transDetail})
         }else{
             res.redirect('/login')
         }
     }catch(error){
         console.error(error.message);
     }
    
   //
}
exports.transactionDetails = async (req,res)=>{
    locals={
        title:"Transaction-Details"
    }
    const id = req.user.id
     try{
         const getuser = await Account_Model.findOne({_id:id})
        
         if(getuser){
            
            res.render('pages/app-transaction-detail',{locals,getuser});
         }else{
             res.redirect('/login')
         }
     }catch(error){
         console.error(error.message);
     }
     
}
exports.view_transaction = async(req,res)=>{
    locals={
        title:"Transaction-Details"
    }
    const id = req.user.id
    const sessionid = req.params.sessionid;
    console.log("sessionid: "+sessionid);
     try{
         const getuser = await Account_Model.findOne({_id:id})
        
         if(getuser){
            
            res.render('pages/app-view-transaction',{locals,getuser});
         }else{
             res.redirect('/login')
         }
     }catch(error){
         console.error(error.message);
     }
     
}
exports.logout = async(req,res)=>{
    res.clearCookie("jwt");
    res.redirect('/login');
}
