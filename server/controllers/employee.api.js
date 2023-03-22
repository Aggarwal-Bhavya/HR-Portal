var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var ObjectId = mongoose.Types.ObjectId;
var Employee = require('../models/employee');
var Attendance = require('../models/attendance');

// 1. Punching in attendance
// 2. Punch ou attendabnce
// 3. viewing month-wise attendance record
// 4. aggregations for month wise attendance
// 5. aggregation for month wise hours worked
// 6. aggregation for compiling month-wise records to create year wise results
var startOfDay = moment().startOf('day').toDate();
var endOfDay = moment().endOf('day').toDate();

router
    .post('/mark-attendance', function (req, res) {
        Attendance.findOne({
            'employee.employeeId': req.body.employeeId,
            'date': { $gte: startOfDay, $lt: endOfDay }
        })
            .then(function (existingAttendance) {
                if (existingAttendance) {
                    res
                        .status(409)
                        .send('Attendance record already exists');
                } else {
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
                        date: new Date(),
                        timeIn: new Date(),
                        leave: null
                    })

                    newAttendance
                        .save()
                        .then(function (item) {
                            res.status(201).json({
                                message: 'Marked clocked in time',
                                clockInData: item
                            })
                        })
                        .catch(function (err) {
                            console.log('Error marking attendance  ', err);
                            res
                                .status(500)
                                .send('Error creating attendance record');
                        })
                }
            })
            .catch(function (err) {
                console.log('Error checking attendance  ', err);
                res
                    .status(500)
                    .send('Error checking attendance record');
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
                        {
                            $set: {
                                timeOut: today,
                                hoursWorked: today.diff(item.timeIn, 'hours'),
                                status: item.hoursWorked >= 8 ? 'present' : (item.hoursWorked >= 4 ? 'half-day' : 'leave')
                            }
                        },
                        { new: true }
                    )
                    .then(function (data) {
                        // console.log(data)
                        res.status(201).json({
                            message: "Employee punched out",
                            attendanceData: data
                        })
                    })
                    .catch(function (err) {
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
    })
    .get('/month-attendance/:empId/:month/:year', function (req, res) {
        var empId = req.params.empId;
        var month = Number(req.params.month);
        var year = Number(req.params.year);

        Attendance
            .find(
                {
                    $expr: {
                        $and: [
                            { $eq: [{ $month: { $ifNull: ['$date', null] } }, month] },
                            { $eq: [{ $year: { $ifNull: ['$date', null] } }, year] }
                        ]
                    },
                    'employee.employeeId': empId,
                    $or: [
                        { status: 'present' },
                        { status: 'half-day' },
                        { status: 'leave' },
                        { status: 'pending' }
                    ]
                },
                {
                    _id: 0,
                    date: 1,
                    timeIn: 1,
                    timeOut: 1,
                    status: 1
                }
            )
            .then(function (item) {
                // console.log(item)
                res.status(201).json({
                    message: 'This month data',
                    record: item
                })
            })
            .catch(function (err) {
                console.log("Error getting month-wise attendance    ", err);
                res.status(500).json({
                    message: 'Error getting month-wise data',
                    data: err
                })
            })
    })
    .get('/hours-worked/:empId/:month/:year', function (req, res) {
        var empId = req.params.empId;
        var month = req.params.month;
        var year = req.params.year;

        var nextMonth = Number(month) + 1;
        var dateString1 = year + "-" + month + "-01";
        var dateString2 = year + "-" + nextMonth + "-01";

        // console.log(dateString1);
        // console.log(dateString2);
        Attendance
            .aggregate([
                { $match: { 'employee.employeeId': ObjectId(empId) } },
                {
                    $match:
                    {
                        date: {
                            $gte: new Date(dateString1),
                            $lt: new Date(dateString2)
                        }
                    }
                },
                {
                    $project: {
                        employee: 1,
                        hoursWorked: 1,
                        date: 1,
                        status: 1
                    }
                },
                {
                    $sort: {
                        date: 1
                    }
                }
            ])
            .then(function (item) {
                // console.log(item);
                res.status(201).json({
                    message: 'Found this month hours worked',
                    hoursData: item
                })
            })
            .catch(function (err) {
                console.log('Error getting hours worked in some month', err);
                res.status(500).json({
                    message: 'Error fetching data',
                    data: err
                })
            })
    })
    .get('/attendance-status/:empId/:month/:year', function (req, res) {
        var empId = req.params.empId;
        var month = req.params.month;
        var year = req.params.year;

        var nextMonth = Number(month) + 1;
        var dateString1 = year + "-" + month + "-01";
        var dateString2 = year + "-" + nextMonth + "-01";

        Attendance
            .aggregate([
                { $match: { 'employee.employeeId': ObjectId(empId) } },
                {
                    $match:
                    {
                        date: {
                            $gte: new Date(dateString1),
                            $lt: new Date(dateString2)
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ])
            .then(function (item) {
                res.status(201).json({
                    message: 'Status count as ',
                    statusData: item
                })
            })
            .catch(function (err) {
                console.log('Status count unable to fetch   ', err);
                res.status(500).json({
                    message: 'Status count unable to fetch',
                    data: err
                })
            })
    })
    .post('/apply-leave', function (req, res) {
        var leave = {
            leaveType: req.body.leaveType,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            duration: req.body.duration,
            comments: req.body.comments,
            approvalStatus: "pending"
        };

        var leaveAttendance = new Attendance({
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
            date: "",
            timeIn: "",
            leave: leave
        });

        leaveAttendance
            .save()
            .then(function (item) {
                console.log(item);
            })
            .catch(function (err) {
                console.log('Error applying for leave   ', err);
            })
    });
// .get('/show-efficiency/:empId/:month/:year', function(req, res) {
//     var empId = req.params.empId;
//     var month = req.params.month;
//     var year = req.params.year;

//     // Attendance  
//     //     .aggregate([
//     //         { $match: { 'employee.employeeId': ObjectId(empId) } },

//     //     ])
// });

module.exports = router;