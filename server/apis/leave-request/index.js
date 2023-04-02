var express = require('express');
var router = express.Router();

var leaveOperations = require('./leaves.controller');

router.post('/apply-leave', leaveOperations.applyLeave);
router.get('/get-leaves/:empId/:branchId', leaveOperations.getLeaveRecords);
router.get('/to-approve-leaves/:empId/:branchId', leaveOperations.toBeApproved);
router.put('/leave-status/:leaveId', leaveOperations.leaveStatusUpdate);

module.exports = router;