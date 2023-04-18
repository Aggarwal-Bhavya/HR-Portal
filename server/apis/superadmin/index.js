var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport.config')(passport);

var superadminMiddleware = require('../../auth-middleware/auth').isSuperAdmin;

var superadminInfoActivity = require('./superadmin-info.controller');

router.get('/superadmin-info', passport.authenticate('jwt', {session: false}), superadminMiddleware, superadminInfoActivity.viewInfo);
router.put('/update-info', passport.authenticate('jwt', {session: false}), superadminMiddleware, superadminInfoActivity.updateInfo);
router.put('/change-password', passport.authenticate('jwt', {session: false}), superadminMiddleware, superadminInfoActivity.changePassword);

module.exports = router;