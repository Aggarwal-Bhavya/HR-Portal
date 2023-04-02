var Employee = require('../../models/employee');
var Attendance = require('../attendance-operations/attendance.model');
var moment = require('moment');

var startOfDay = moment().startOf('day').toDate();
var endOfDay = moment().endOf('day').toDate();

var markAttendanceOperation = {
    timeInAttendance: function (req, res) {
        Attendance.findOne({
            'employee.employeeId': req.body.employeeId,
            'present.date': { $gte: startOfDay, $lt: endOfDay }
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
                        present: {
                            date: new Date(),
                            timeIn: new Date(),
                            hoursWorked: 0
                        },
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
    },

    timeOutAttendance: function (req, res) {
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
                                'present.timeOut': today,
                                'present.hoursWorked': today.diff(item.present.timeIn, 'hours'),
                                status: item.present.hoursWorked >= 8 ? 'present' : (item.present.hoursWorked >= 4 ? 'half-day' : 'leave')
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
    }
};

module.exports = markAttendanceOperation;