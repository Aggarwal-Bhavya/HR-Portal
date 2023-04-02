var express = require('express');
var router = express.Router();

var superadminStats = require('../superadmin-analytics/superadmin-stats');

router.get('/company-count', superadminStats.getCompanyCount);

module.exports = router;