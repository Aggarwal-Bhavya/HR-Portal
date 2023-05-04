var Attendance = require('../attendance-operations/attendance.model');
var Leave = require('../leave-request/leave-request.model');
var mongoose = require('mongoose');
var moment = require('moment');
var ObjectId = mongoose.Types.ObjectId;

var leaveOperations = {
    applyLeave: function (req, res) {
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
                res.status(201).json({
                    message: 'New leave request generated',
                    leaveData: item
                })
            })
            .catch(function (err) {
                console.log('Error generating leave request   ', err);
                res.status(500).json({
                    message: 'Error generating leave request',
                    data: err
                })
            })
    },

    getLeaveRecords: function (req, res) {
        var empId = req.params.empId;
        var branchId = req.params.branchId;

        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

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
            .then(function (item) {
                var paginatedData = item.slice(startIndex, endIndex);

                res.status(201).json({
                    message: 'All leaves data for this employee is',
                    leaveData: paginatedData,
                    totalCount: item.length
                })
            })
            .catch(function (err) {
                console.log('Error fetching leaves data   ', err);
                res.status(500).json({
                    message: 'Error fetching employee leave info',
                    data: err
                })
            })
    },

    toBeApproved: function (req, res) {
        var empId = req.params.empId;
        var branchId = req.params.branchId;

        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

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
                var paginatedData = item.slice(startIndex, endIndex);

                // console.log(item);
                res.status(201).json({
                    message: 'Leaves to be approved by you are',
                    leavesToApprove: paginatedData,
                    totalCount: item.length
                })
            })
            .catch(function (err) {
                console.log('Error getting leaves to approve   ', err);
                res.status(500).json({
                    message: 'Error getting leaves to approve',
                    data: err
                })
            })
    },

    leaveRecordsFilter: function (req, res) {
        var empId = req.params.empId;
        var branchId = req.params.branchId;

        var status = req.query.status;
        var startDateValue = req.query.startDateValue ? new Date(req.query.startDateValue) : new Date(new Date().getFullYear(), 0, 1);
        var endDateValue = req.query.endDateValue ? new Date(req.query.endDateValue) : new Date();

        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

        var query = {};
    

        if(status !== undefined) {
            if(status === 'pending') {
                query['leaveDetails.approvalStatus'] = 'pending';
            } else if(status === 'approved') {
                query['leaveDetails.approvalStatus'] = 'approved';
            } else if(status === 'rejected') {
                query['leaveDetails.approvalStatus'] = 'rejected';
            }
        }

        if(startDateValue !== undefined && endDateValue !== undefined) {
            if(endDateValue < startDateValue) {
                res.status(400).json({
                    message: 'Invalid date range',
                    data: null
                })
                return;
            }
            query['leaveDetails.startDate'] = {$gt: startDateValue, $lt: endDateValue};
        }

        query['employee.employeeId'] = empId;
        query['branch.branchId'] = branchId;

        // console.log(query);

        Leave
            .find(
                query,
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
            .then(function (item) {
                var paginatedData = item.slice(startIndex, endIndex);

                res.status(201).json({
                    message: 'All leaves data for this employee is',
                    leaveData: paginatedData,
                    totalCount: item.length
                })
            })
            .catch(function (err) {
                console.log('Error fetching leaves data   ', err);
                res.status(500).json({
                    message: 'Error fetching employee leave info',
                    data: err
                })
            })
    },

    approvalLeavesFilter: function (req, res) {
        var empId = req.params.empId;
        var branchId = req.params.branchId;

        var type = req.query.type;
        var status = req.query.status;
        var startDateValue = req.query.startDateValue ? new Date(req.query.startDateValue) : new Date(new Date().getFullYear(), 0, 1);
        var endDateValue = req.query.endDateValue ? new Date(req.query.endDateValue) : new Date();

        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

        var query = {};
    

        if(type !== undefined) {
            if(type === 'casual') {
                query['leaveDetails.leaveType'] = 'casual';
            } else if(type === 'sick') {
                query['leaveDetails.leaveType'] = 'sick';
            } else if(type === 'personal') {
                query['leaveDetails.leaveType'] = 'personal';
            } else if(type === 'vacation') {
                query['leaveDetails.leaveType'] = 'vacation';
            } else if(type === 'emergency') {
                query['leaveDetails.leaveType'] = 'emergency';
            }
        }

        if(status !== undefined) {
            if(status === 'pending') {
                query['leaveDetails.approvalStatus'] = 'pending';
            } else if(status === 'approved') {
                query['leaveDetails.approvalStatus'] = 'approved';
            } else if(status === 'rejected') {
                query['leaveDetails.approvalStatus'] = 'rejected';
            }
        }

        if(startDateValue !== undefined && endDateValue !== undefined) {
            if(endDateValue < startDateValue) {
                res.status(400).json({
                    message: 'Invalid date range',
                    data: null
                })
                return;
            }
            query['leaveDetails.startDate'] = {$gt: startDateValue, $lt: endDateValue};
        }

        query['reportingTo.managerId'] = empId;
        query['branch.branchId'] = branchId;
        // console.log(query);

    
        Leave
            .find(
                query,
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
            .then(function (item) {
                var paginatedData = item.slice(startIndex, endIndex);

                res.status(201).json({
                    message: 'All leaves data for this employee is',
                    leaveData: paginatedData,
                    totalCount: item.length
                })
            })
            .catch(function (err) {
                console.log('Error fetching leaves data   ', err);
                res.status(500).json({
                    message: 'Error fetching employee leave info',
                    data: err
                })
            })
    },

    leaveStatusUpdate: function (req, res) {
        var id = req.params.leaveId;
        var status = req.body.status;
        var start = req.body.startDate;
        var end = req.body.endDate;

        Leave
            .findById(id)
            .then(function (leave) {
                leave.leaveDetails.approvalStatus = status;

                leave
                    .save(function (err, updatedLeave) {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        }

                        if (status === 'approved') {
                            var startDate = new Date(start);
                            var endDate = new Date(end);
                            var durationInDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

                            var dateArray = [];
                            for (var i = 0; i <= durationInDays; i++) {
                                var currentDate = new Date(start);
                                currentDate.setDate(startDate.getDate() + i);
                                if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
                                    dateArray.push(currentDate);
                                }
                            }

                            var leaveDocs = dateArray.map(function (date) {
                                return {
                                    employee: updatedLeave.employee,
                                    reportingTo: updatedLeave.reportingTo,
                                    branch: updatedLeave.branch,
                                    company: updatedLeave.company,
                                    leave: {
                                        leaveType: updatedLeave.leaveDetails.leaveType,
                                        date: date,
                                        leaveId: updatedLeave._id,
                                        comments: updatedLeave.comments
                                    },
                                    present: null,
                                    status: 'leave'
                                }
                            })

                            Attendance
                                .insertMany(leaveDocs)
                                .then(function (items) {
                                    if (items.length === 0) {
                                        res.status(400).send('Error: No documents were inserted.')
                                    } else {
                                        res.status(201).json({
                                            message: 'Documents were successfully inserted',
                                            leaveData: items
                                        })
                                    }
                                })
                                .catch(function (err) {
                                    console.log('Error creating leaves   ', err);
                                    res.status(500).json({
                                        message: 'Error in creating leaves',
                                        data: err
                                    })
                                });
                        } else {
                            res.status(201).json({
                                message: 'Leave rejected'
                            })
                        }
                    })
            })
            .catch(function (err) {
                console.log('Error updating leaves status  ', err);
                res.status(500).json({
                    message: 'Error updating leaves status',
                    data: err
                })
            })
    }
};

module.exports = leaveOperations;