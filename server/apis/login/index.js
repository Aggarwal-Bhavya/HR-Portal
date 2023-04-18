var express = require('express');
var router = express.Router();
var loginControl = require('./login.controller');
// var passport = require("passport");
const passport = require('passport');
// const jwt = require('jsonwebtoken');

// router.post('/check-login-info', passport.authenticate('local', { session: false }), loginControl.checkUser);
router.post('/check-login-info', loginControl.checkUser);
module.exports = router;