// var Employee = require('../../models/employee');
var Attendance = require('../attendance-operations/attendance.model');
var LeaveRequest = require('../leave-request/leave-request.model');
var moment = require('moment');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var attendanceRecords = {
    monthlyAttendance: function (req, res) {
        var empId = req.params.empId;
        var month = Number(req.params.month);
        var year = Number(req.params.year);

        Attendance
            .find(
                {
                    $or: [
                        {
                            $and: [
                                { $type: { $ifNull: ['$present.date', 'null'] } },
                                { $eq: [{ $month: { $ifNull: ['$present.date', null] } }, month] },
                                { $eq: [{ $year: { $ifNull: ['$present.date', null] } }, year] }
                            ]
                        },
                        {
                            $and: [
                                { $type: { $ifNull: ['$leave.date', 'null'] } },
                                { $eq: [{ $month: { $ifNull: ['$leave.date', null] } }, month] },
                                { $eq: [{ $year: { $ifNull: ['$leave.date', null] } }, year] },
                                // { 'leave.approvalStatus': 'approved' }
                            ]
                        }
                    ],
                    'employee.employeeId': empId,
                    $or: [
                        { status: 'present' },
                        { status: 'half-day' },
                        { status: 'leave' },
                        // { status: 'pending' }
                    ]
                },
                {
                    _id: 0,
                    'present.date': 1,
                    'present.timeIn': 1,
                    'present.timeOut': 1,
                    'leave.date': 1,
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
    },

    hoursWorked: function (req, res) {
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
                        'present.date': {
                            $gte: new Date(dateString1),
                            $lt: new Date(dateString2)
                        }
                    }
                },
                {
                    $project: {
                        employee: 1,
                        'present.hoursWorked': 1,
                        'present.date': 1,
                        status: 1
                    }
                },
                {
                    $sort: {
                        'present.date': 1
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
    },

    attendanceStatus: function (req, res) {
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
                        $or: [
                            {
                                'present.date': {
                                    $gte: new Date(dateString1),
                                    $lt: new Date(dateString2)
                                }
                            },
                            {
                                'leave.date': {
                                    $gte: new Date(dateString1),
                                    $lt: new Date(dateString2)
                                }
                            }
                        ]
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
    },

    yearlyRatios: function (req, res) {
        var empId = req.params.empId;
        var year = Number(req.params.year);

        var dateString1 = new Date(year, 1, 1);
        var dateString2 = new Date(year, 12, 31);

        Attendance
            .aggregate([
                {
                    $match:
                    {
                        'employee.employeeId': ObjectId(empId),
                        $or:
                            [
                                {
                                    'present.date':
                                    {
                                        $gte: dateString1,
                                        $lte: dateString2
                                    }
                                },
                                {
                                    'leave.date':
                                    {
                                        $gte: dateString1,
                                        $lte: dateString2
                                    }
                                }
                            ]
                    }
                },
                {
                    $group:
                    {
                        _id: null,
                        totalHoursWorked:
                        {
                            $sum: '$present.hoursWorked'
                        },
                        totalPresents:
                        {
                            $sum:
                            {
                                $cond:
                                {
                                    if: { $eq: ['$status', 'present'] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        totalLeaves:
                        {
                            $sum:
                            {
                                $cond:
                                {
                                    if: { $eq: ['$status', 'leave'] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        }
                    }
                },
            ])
            .then(function (item) {
                res.status(201).json({
                    message: 'Totals found for year',
                    yearData: item
                })
            })
            .catch(function (err) {
                console.log('Error in aggregation for year records   ', err);
                res.status(500).json({
                    message: 'Error in getting year data',
                    data: err
                })
            })
    },

    monthlyRatios: function (req, res) {
        var empId = req.params.empId;
        var month = Number(req.params.month);
        var year = Number(req.params.year);

        var dateString1 = new Date(year, month - 1, 1);
        var dateString2 = new Date(year, month, 1);

        LeaveRequest
            .aggregate([
                {
                    $match:
                    {
                        'employee.employeeId': ObjectId(empId),
                        'leaveDetails.startDate':
                        {
                            $gte: dateString1,
                            $lt: dateString2
                        },
                        'leaveDetails.endDate':
                        {
                            $gte: dateString1,
                            $lt: dateString2
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: null,
                        totalLeavesApplied: { $sum: 1 },
                        approvedLeaves:
                        {
                            $sum:
                            {
                                $cond:
                                {
                                    if: { $eq: ['$leaveDetails.approvalStatus', 'approved'] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        rejectedLeaves:
                        {
                            $sum:
                            {
                                $cond:
                                {
                                    if: { $eq: ['$leaveDetails.approvalStatus', 'rejected'] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        pendingStatus:
                        {
                            $sum:
                            {
                                $cond:
                                {
                                    if: { $eq: ['$leaveDetails.approvalStatus', 'pending'] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        avgDuration:
                        {
                            $avg: '$leaveDetails.duration'
                        }
                    }
                },
            ])
            .then(function (item) {
                res.status(201).json({
                    message: 'Result for monthly stats is: ',
                    monthData: item
                })
            })
            .catch(function (err) {
                console.log('Error in monthly stats  ', err);
                res.status(500).json({
                    message: 'Error while calculating monthly stats',
                    data: err
                })
            })
    }
};

module.exports = attendanceRecords;