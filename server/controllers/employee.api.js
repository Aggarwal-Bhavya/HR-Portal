var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var ObjectId = mongoose.Types.ObjectId;
var Employee = require('../models/employee');
var Attendance = require('../models/attendance');

router
    .post('/mark-attendance', function (req, res) {
        var newAttendance = new Attendance({
            employee: {
                employeeId: req.body.employeeId,
                employeeEmail: req.body.employeeEmail,
                employeeName: req.body.employeeName
            },
            reportingTo: {
                managerId: req.body.managerId,
                managerName: req.body.managerName,
                // managerEmail: req.body.managerEmail
            },
            branch: {
                branchId: req.body.branchId,
                branchName: req.body.branchName,
                branchCity: req.body.branchCity
            },
            company: {
                companyId: req.body.companyId,
                companyName: req.body.companyName
            },
            // date: new Date().toLocaleDateString("en-US"),
            // timeIn: new Date().toLocaleTimeString("en-US")
            date: new Date(),
            timeIn: new Date()
        })

        newAttendance
            .save()
            .then(function (item) {
                console.log(item);
                res.status(201).json({
                    message: 'Marked clocked in time',
                    clockInData: item
                })
            })
            .catch(function (err) {
                console.log('Error marking attendance  ', err);
                res.status(500).json({
                    message: 'Error clocking in',
                    data: err
                })
            })
    })
    .get('/show-attendance/:id/:empId', function (req, res) {
        var id = req.params.id;
        var empId = req.params.empId;
        Attendance
            // .find({ _id: id })
            .aggregate([
                // { '$match': { 'employee.employeeName': 'Chirag', 'employee.employeeId': ObjectId('641160656b6b5a5003a4c01f') } },
                // { '$match': { '_id': ObjectId(id), 'employee.employeeId': ObjectId('640ecb5cf67639b842975660') } },
                { '$match': { '_id': ObjectId(id), 'employee.employeeId': ObjectId(empId) } },
                {
                    '$project': {
                        _id: 0,
                        'employee.employeeName': 1,
                        dateString: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$date" } },
                        attendanceDate: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        timeIn: { $dateToString: { format: "%H:%M:%S:%L%z", date: "$timeIn", timezone: "+05:30" } },
                        timeOut: { $dateToString: { format: "%H:%M:%S:%L%z", date: "$timeOut", timezone: "+05:30" } },
                        minutesOffset530: { $dateToString: { format: "%Z", date: "$timeIn", timezone: "+05:30" } }
                    }
                }
            ])
            .then(function (item) {
                // console.log(data)
                res.status(201).json({
                    message: 'Attendance record is obtained',
                    attendanceData: item
                })
            })
            .catch(function (err) {
                console.log('Error obtaining attendance record', err);
                res.status(500).json({
                    message: 'Error in getting attendance record',
                    data: err
                })
            })
    })
    .put('/time-out/:id/:empId', function (req, res) {
        var id = req.params.id;
        var empId = req.params.empId;

        var today = moment(new Date());
        
        Attendance
            .findOne({
                $and: [
                    { _id: id },
                    { 'employee.employeeId': empId }
                ]
            })
            .then(function (item) {
                // console.log(item.timeIn);

                Attendance
                    .updateOne(
                        { _id: id },
                        { $set: {
                            timeOut: today,
                            hoursWorked: today.diff(item.timeIn, 'hours'),
                            status: item.hoursWorked >= 8 ? 'present' : (item.hoursWorked >= 4 ? 'half-day' : 'leave')
                        } },
                        { new: true }
                    )
                    .then(function(data) {
                        // console.log(data)
                        res.status(201).json({
                            message: "Employee punched out",
                            attendanceData: data
                        })
                    })
                    .catch(function(err) {
                        console.log('Error punching out   ', err);
                        res.status(500).json({
                            message: "Error punching out employee",
                            data: err
                        })
                    })
            })
            .catch(function (err) {
                console.log(err);
            })
    });

module.exports = router;