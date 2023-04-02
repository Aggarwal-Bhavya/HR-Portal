var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');

var ObjectId = mongoose.Types.ObjectId;
var Attendance = require('../models/attendance');
var Leave = require('../models/leaveRequest');

const LEAVE_REQUEST_EVENT = 'leave-request';
const LEAVE_APPROVAL_EVENT = 'leave-approval';

router
    .post('/apply-leave', function (req, res) {
        var start = new Date(req.body.startDate);
        var end = new Date(req.body.endDate);
        var duration = req.body.duration;

        var leaveType = req.body.leaveType;
        var comments = req.body.comments;

        var employee = {
            employeeId: req.body.employeeId,
            employeeEmail: req.body.employeeEmail,
            employeeName: req.body.employeeName
        };

        var reportingTo = {
            managerId: req.body.managerId,
            managerName: req.body.managerName,
            // managerEmail: req.body.managerEmail
        };

        var branch = {
            branchId: req.body.branchId,
            branchName: req.body.branchName,
            branchCity: req.body.branchCity
        };

        var company = {
            companyId: req.body.companyId,
            companyName: req.body.companyName
        };

        var newLeave = new Leave({
            employee: employee,
            reportingTo: reportingTo,
            branch: branch,
            company: company,
            leaveDetails: {
                leaveType: leaveType,
                startDate: start,
                endDate: end,
                duration: duration,
                approvalStatus: 'pending',
                comments: comments
            }
        });

        newLeave
            .save()
            .then(function (item) {
                // emiting a socket event to reporting manager's socket room
                // io
                //     .to(reportingTo.managerId)
                //     .emit(LEAVE_REQUEST_EVENT, item);

                res.status(201).json({
                    message: 'New leave request generated',
                    leaveData: item
                })
            })
            .catch(function(err) {
                console.log('Error generating leave request   ', err);
                res.status(500).json({
                    message: 'Error generating leave request',
                    data: err
                })
            })

        // var dates = [];
        // while (start <= end) {
        //     dates.push(new Date(start));
        //     start.setDate(start.getDate() + 1);
        // }


        // var leaveDocs = dates.map(function (date) {
        //     return {
        //         employee: employee,
        //         reportingTo: reportingTo,
        //         branch: branch,
        //         company: company,
        //         leave: {
        //             leaveType: leaveType,
        //             date: date,
        //             approvalStatus: 'pending',
        //             comments: comments
        //         },
        //         present: null,
        //         status: 'pending'
        //     }
        // })

        // Attendance
        //     .insertMany(leaveDocs)
        //     .then(function (items) {
        //         if (items.length === 0) {
        //             res.status(400).send('Error: No documents were inserted.')
        //         } else {
        //             res.status(201).json({
        //                 message: 'Documents were successfully inserted',
        //                 leaveData: items
        //             })
        //         }
        //     })
        //     .catch(function (err) {
        //         console.log('Error creating leaves   ', err);
        //         res.status(500).json({
        //             message: 'Error in creating leaves',
        //             data: err
        //         })
        //     })
    })
    .get('/get-leaves/:empId/:branchId', function (req, res) {
        var empId = req.params.empId;
        var branchId = req.params.branchId;

        Leave
            .find(
                {
                    'employee.employeeId': empId,
                    'branch.branchId': branchId,
                }, 
                {
                    employee: 1,
                    leaveDetails: 1,
                    createdAt: 1
                }
            )
            .sort(
                {
                    createdAt: -1
                }
            )
            .then(function(items) {
                res.status(201).json({
                    message: 'All leaves data for this employee is',
                    leaveData: items
                })
            })
            .catch(function(err) {
                console.log('Error fetching leaves data   ', err);
                res.status(500).json({
                    message: 'Error fetching employee leave info',
                    data: err
                })
            })

    })
    .get('/to-approve-leaves/:empId/:branchId', function (req, res) {
        var empId = req.params.empId;
        var branchId = req.params.branchId;

        Leave
            .find(
                {
                    'branch.branchId': branchId,
                    'reportingTo.managerId': empId,
                    'leaveDetails.approvalStatus': 'pending'
                },
                {
                    'employee.employeeName': 1,
                    reportingTo: 1,
                    leaveDetails: 1,
                    status: 1,
                    createdAt: 1
                }
            )
            .then(function (item) {
                // console.log(item);
                res.status(201).json({
                    message: 'Leaves to be approved by you are',
                    leavesToApprove: item
                })
            })
            .catch(function (err) {
                console.log('Error getting leaves to approve   ', err);
                res.status(500).json({
                    message: 'Error getting leaves to approve',
                    data: err
                })
            })
    });


// creating a socket.io connection listener
// io.on('connection', function(socket) {
//     console.log('a user connected');

//     socket.on(LEAVE_APPROVAL_EVENT, function(data) {
//         Leave
//             .findOneAndUpdate(
//                 { _id: data.leaveId },
//                 { $set: {'leaveDetails.approvalStatus': data.approvalStatus} },
//                 { new: true }
//             )
//             .then(function(item) {
//                 io
//                     .to(item.employee.employeeId)
//                     .emit(LEAVE_APPROVAL_EVENT, item);
//             })
//             .catch(function(err) {
//                 console.log('Error updating leave   ', err);
//             });
//     });

//     socket.on('join-room', function(roomId) {
//         socket.join(roomId);
//     });
// });

module.exports = router;