const express = require('express');
const router = express.Router();
const api_routes = require('../controller/api_controller');


router.post('/createAccount',api_routes.createAcount)
router.post('/login',api_routes.login);
router.post('/updatebalance',api_routes.updateBalance);

module.exports = router