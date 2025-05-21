 const Account_Model = require('../model/account_model');
 const Balance_Model = require('../model/account_Balance');
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
            res.render('pages/index',{locals,getuser,get_balance})
         }else{
             res.redirect('/login')
         }
     }catch(error){
         console.error(error.message);
     }
    
   //
}
 
exports.logout = async(req,res)=>{
    res.clearCookie("jwt");
    res.redirect('/login');
}
