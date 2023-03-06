var express = require('express');
var router = express.Router();

// routes for different apis
// router.use("/hr-employee", require("../controllers/hrEmployees.api"));
// router.use("/department-head", require("../controllers/departmentHead.api"));

router.use("/superadmin", require("../controllers/superadmin.api"));
router.use("/company", require("../controllers/company.api"));
router.use("/login", require("../controllers/login.api"));

module.exports = router;