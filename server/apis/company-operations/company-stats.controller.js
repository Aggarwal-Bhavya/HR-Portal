var Employee = require('../employee-operations/employee.model');
var Attendance = require('../attendance-operations/attendance.model');
var moment = require('moment');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var companyStats = {
    companyHeadCount: function (req, res) {
        var companyId = req.params.id;

        Employee
            .aggregate([
                {
                    $match: { 'company.companyId': ObjectId(companyId) }
                },
                {
                    $group:
                    {
                        _id: 'head count',
                        count: { $sum: 1 }
                    }
                }
            ])
            .then(function (item) {
                res.status(201).json({
                    message: 'Company head count',
                    headCount: item
                })
            })
            .catch(function (err) {
                console.log('Error finding company head count  ', err)
                res.status(500).json({
                    message: 'Head count error',
                    data: err
                })
            })
    },

    branchPerformance: function (req, res) {
        var compId = req.params.id;
        var year = Number(req.params.year);

        var dateString1 = year + "-01-01";
        var dateString2 = (year + 1) + "-01-01";

        // console.log(dateString1, dateString2);
        Attendance
            .aggregate([
                {
                    $match:
                    {
                        'company.companyId': ObjectId(compId)
                    }
                },
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
                    $group:
                    {
                        _id: '$branch',
                        totalHoursWorked:
                        {
                            $sum: '$present.hoursWorked'
                        },
                        uniqueEmployees:
                        {
                            $addToSet: '$employee.employeeId'
                        }
                    }
                },
                {
                    $project:
                    {
                        _id: 0,
                        branchDetails: '$_id',
                        totalHoursWorked: 1,
                        numEmployees:
                        {
                            $size: '$uniqueEmployees'
                        },
                        avgPerformance:
                        {
                            $divide: [
                                '$totalHoursWorked',
                                { $size: '$uniqueEmployees' }
                            ]
                        }
                    }
                },
                {
                    $sort:
                    {
                        avgPerformance: -1
                    }
                }
            ])
            .then(function (item) {
                res.status(201).json({
                    message: 'Hours worked',
                    branch: item
                })
            })
            .catch(function (err) {
                console.log('Error getting hours worked by each branch   ', err);
                res.status(500).json({
                    message: 'Error getting hours worked',
                    data: err
                })
            })
    },

    performanceAnalysis: function (req, res) {
        var compId = req.params.id;
        var month = Number(req.params.month);
        var year = Number(req.params.year);

        var dateString1 = new Date(year, month - 1, 1);
        var dateString2 = new Date(year, month, 1);

        Attendance
            .aggregate([
                {
                    $match:
                    {
                        'company.companyId': ObjectId(compId),
                        'present.date':
                        {
                            $gte: dateString1,
                            $lt: dateString2
                        }
                    }
                },
                {
                    $group:
                    {
                        _id:
                        {
                            branch: '$branch.branchName',
                            week: { $week: '$present.date' }
                        },
                        totalHours: { $sum: '$present.hoursWorked' },
                        headCount: { $addToSet: '$employee.employeeId' }
                    }
                },
                {
                    $group:
                    {
                        _id:
                        {
                            branch: '$_id.branch',
                            week: '$_id.week'
                        },
                        performance: {
                            $avg: { $divide: ['$totalHours', { $size: '$headCount' }] }
                        }
                    }
                }
            ])
            .then(function (item) {
                res.status(201).json({
                    message: 'Monthly record',
                    monthData: item
                })
            })
            .catch(function (err) {
                console.log('Error aggregating monthly data   ', err);
                res.status(500).json({
                    message: 'Error aggregating monthly data',
                    data: err
                })
            })
    },

    monthlyRatios: function (req, res) {
        var compId = req.params.compId;
        var branchId = req.params.branchId;
        var month = Number(req.params.month);
        var year = Number(req.params.year);
        
        var dateString1 = new Date(year, month - 1, 1);
        var dateString2 = new Date(year, month, 1);


        async.waterfall([
            // Function 1: to get the head count
            function getHeadCount(callback) {
                // console.log('geting head count for a branch');
                Employee
                    .aggregate([
                        {
                            $match:
                            {
                                $and:[
                                    {'company.companyId': ObjectId(compId)},
                                    {'branch.branchId': ObjectId(branchId)},
                                    {createdAt: {
                                        $lt: dateString2
                                    }}
                                ]
                            }
                        },
                        {
                            $group:
                            {
                                _id: null,
                                count: { $sum: 1 }
                            }
                        }
                    ], callback);
            },

            // Function 2: calculating rates
            function calculateRates(result, callback) {
                // console.log('calculating rates');
                // console.log('   Water fall    ')
                // console.log(result);
                var headCount = result[0] && result[0].count ? result[0].count : 0;

                // console.log(headCount);

                if (headCount === 0) {
                    callback(null, {
                        headCount: 0,
                        turnoverRate: 0,
                        hiringRate: 0
                    });
                } else {

                    Employee
                        .aggregate([
                            {
                                $match:
                                {
                                    'company.companyId': ObjectId(compId),
                                    'branch.branchId': ObjectId(branchId),
                                    'employeeDetails.dateOfLeaving': {
                                        $gte: dateString1,
                                        $lt: dateString2
                                    }
                                }
                            },
                            {
                                $group:
                                {
                                    _id: null,
                                    count: { $sum: 1 }
                                }
                            }
                        ], function (err, result) {
                            if (err) {
                                callback(err)
                            } else {
                                // console.log(result[0])
                                var turnoverRate = result[0] && result[0].count ? (result[0].count / headCount) * 100 : 0;
                                // console.log(turnoverRate);

                                Employee
                                    .aggregate([
                                        {
                                            $match:
                                            {
                                                'company.companyId': ObjectId(compId),
                                                'branch.branchId': ObjectId(branchId),
                                                createdAt: {
                                                    $gte: dateString1,
                                                    $lt: dateString2
                                                }
                                            }
                                        },
                                        {
                                            $group:
                                            {
                                                _id: null,
                                                count: { $sum: 1 }
                                            }
                                        }
                                    ], function (err, result) {
                                        if (err) {
                                            callback(err)
                                        } else {
                                            var hiringRate = result[0] && result[0].count ? (result[0].count / headCount) * 100 : 0;
                                            // console.log(hiringRate);

                                            callback(null, {
                                                headCount: headCount,
                                                hiringRate: hiringRate,
                                                turnoverRate: turnoverRate
                                            });
                                        }
                                    });
                            }
                        });
                }
            }


        ], function (err, result) {
            if (err) {
                console.log('Error in waterfall    ', err);
                res.status(500).json({
                    message: 'Some error while waterfall',
                    data: err
                })
            } else {
                res.status(201).json({
                    message: 'Ratios for this month are',
                    monthRatios: result
                })
            }
        })


    }

};

module.exports = companyStats;