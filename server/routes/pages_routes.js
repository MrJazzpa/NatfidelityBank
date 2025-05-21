const express  = require('express');
const router = express.Router();
const pages = require('../controller/pages_controller');
const verify_token = require('../middleware/verify_token');

router.get('/login',pages.login);
router.get('/logout',pages.logout)
router.get('/userDashboard',verify_token,pages.userDashboard);



module.exports=router