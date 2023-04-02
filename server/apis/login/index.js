var express = require('express');
var router = express.Router();
var loginControl = require('./login.controller');

router.post('/check-login-info', loginControl.checkUser);

module.exports = router;