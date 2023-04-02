var express = require('express');
var router = express.Router();

var attendanceOperation = require('./employee-attendance.controller');
var attendanceRecords = require('./employee-attendance-stats');

router.post('/mark-attendance', attendanceOperation.timeInAttendance);
router.put('/time-out/:id/:empId', attendanceOperation.timeOutAttendance);
router.get('/month-attendance/:empId/:month/:year', attendanceRecords.monthlyAttendance);
router.get('/hours-worked/:empId/:month/:year', attendanceRecords.hoursWorked);
router.get('/attendance-status/:empId/:month/:year', attendanceRecords.attendanceStatus);
router.get('/year-stats/:empId/:year', attendanceRecords.yearlyRatios);
router.get('/month-stats/:empId/:month/:year', attendanceRecords.monthlyRatios);

module.exports = router;