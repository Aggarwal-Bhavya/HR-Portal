var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport.config')(passport);

var leaveOperations = require('./leaves.controller');

router.post('/apply-leave', passport.authenticate('jwt', {session: false}), leaveOperations.applyLeave);

router.get('/get-leaves/:empId/:branchId', passport.authenticate('jwt', {session: false}), leaveOperations.getLeaveRecords);

router.get('/filter-my-leaves/:empId/:branchId', leaveOperations.leaveRecordsFilter);

router.get('/filter-to-approve/:empId/:branchId', leaveOperations.approvalLeavesFilter);

router.get('/to-approve-leaves/:empId/:branchId', passport.authenticate('jwt', {session: false}), leaveOperations.toBeApproved);

router.put('/leave-status/:leaveId', passport.authenticate('jwt', {session: false}), leaveOperations.leaveStatusUpdate);

module.exports = router;