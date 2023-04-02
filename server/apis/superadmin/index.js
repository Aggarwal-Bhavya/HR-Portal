var express = require('express');
var router = express.Router();

var superadminInfoActivity = require('./superadmin-info.controller');

router.get('/superadmin-info', superadminInfoActivity.viewInfo);
router.put('/update-info', superadminInfoActivity.updateInfo);

module.exports = router;