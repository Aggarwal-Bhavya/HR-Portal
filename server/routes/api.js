var express = require('express');
var router = express.Router();

// routes for different apis
// configures all the routes for our application

router.use("/login", require("../apis/login/index"));


router.use("/superadmin", require("../apis/superadmin/index"));
router.use("/superadmin", require("../apis/company-operations/index"));
// router.use("/superadmin", require("../apis/superadmin-analytics/index"));

router.use("/company", require("../apis/branch-operations/index"));
router.use("/company", require("../apis/company-operations/index"));

router.use("/branch", require("../apis/employee-operations/index"));
router.use("/branch", require("../apis/branch-operations/index"));

router.use("/hradmin", require("../apis/employee-operations/index"));
router.use("/hradmin", require("../apis/branch-operations/index"));

router.use("/employee", require("../apis/attendance-operations/index"));

router.use("/attendance", require("../apis/leave-request/index"));


module.exports = router;