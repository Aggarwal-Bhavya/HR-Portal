var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');
var Branch = require('../models/branch');

// 1. Viewing all employees
// 2. Adding employees
// 3. Managing employee data
// 4. Updating their data
// 5. Marking attendance
// 6. Approving leaves 
// 7. Employee migration from branch or department

router
    .get('/all-employees/:id', function (req, res) {
        var id = req.params.id;
        Employee
            .find({
                $and: [
                    { "branch.branchId": id },
                    { isActive: true },
                    {
                        $or: [
                            { employeeRole: "departmenthead" },
                            { employeeRole: "employee" }
                        ]
                    }
                ]
            })
            .then(function (item) {
                res.status(201).json({
                    message: 'All employees of this branch are ',
                    branchData: item
                })
            })
            .catch(function (err) {
                console.log('Error in fetching branch employee info   ', err);
                res.status(500).json({
                    message: 'Branch employee error  ',
                    data: err
                })
            })
    })
    .get('/department-heads/:id', function (req, res) {
        var id = req.params.id;
        Employee
            .find({
                $and: [
                    { employeeRole: "departmenthead" },
                    { "reportingTo.role": "branchadmin" },
                    { isActive: true },
                    { "branch.branchId": id }
                ]
            })
            .then(function (item) {
                // console.log(item)
                res.status(201).json({
                    message: "Department heads of this branch are",
                    departmentHeads: item
                })
            })
            .catch(function (err) {
                console.log("Error in finding department heads   ", err);
                res.status(500).json({
                    message: "Department head data fetch error",
                    data: err
                })
            })
    })
    .get('/employee-info/:id', function (req, res) {
        var id = req.params.id;

        Employee
            .findById({
                _id: id
            })
            .then(function (item) {
                // console.log(item)
                res.status(201).json({
                    message: 'Employee data found',
                    employeeData: item
                })
            })
            .catch(function (err) {
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    })
    .get('/branch-departments/:id', function (req, res) {
        var id = req.params.id;

        Branch
            .findOne(
                { _id: id },
                {
                    departments: 1,
                    _id: 0,
                    branchName: 1
                }
            )
            .then(function (item) {
                // console.log(item);
                res.status(201).json({
                    message: 'Found branch department data',
                    departments: item
                })
            })
            .catch(function (err) {
                console.log("Error fetching branch department data   ", err);
                res.status(500).json({
                    message: 'Branch Departments not found',
                    data: err
                })
            })
    })
    .put('/update-employee-info/:id', function(req, res) {
        var id = req.params.id;

        var updateEmployee = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            personalEmail: req.body.personalEmail,
            maritalStatus: req.body.maritalStatus,
            designation: req.body.designation,
            department: req.body.department,
            employeeRole: req.body.employeeRole,
        }

        Employee
            .findByIdAndUpdate(
                { _id: id },
                { $set: updateEmployee },
                { new: true }
            )
            .then(function (item) {
                res.status(201).json({
                    message: 'Updated employee information',
                    employeeData: item
                })
            })
            .catch(function (err) {
                console.log('Error in updating employee info    ', err);
                res.status(500).json({
                    message: 'Employee information update fail',
                    data: err
                })
            })
    })
    .put('/remove-employee/:id', function(req, res) {
        var id = req.params.id;

        Employee
            .findByIdAndUpdate(
                { _id: id }, 
                { $set: { isActive: false } }
            )
            .then(function(item) {
                res.status(201).json({
                    message: 'Employee removed'
                })
            })
            .catch(function(err) {
                console.log('Error removing employee   ', err);
                res.status(500).json({
                    message: 'Error removing employee', 
                    data: err
                })
            })
    })
    .get('/all-previous-employees/:id', function(req, res) {
        var id = req.params.id;

        Employee
            .find({
                $and: [
                    { "branch.branchId": id },
                    { isActive: false }
                ]
            })
            .then(function(item) {
                res.status(201).json({
                    message: 'All previous employees of this branch are ',
                    previousEmployeesData: item
                })
            })
            .catch(function (err) {
                console.log('Error in fetching previous branch employees info   ', err);
                res.status(500).json({
                    message: 'Branch employee error  ',
                    data: err
                })
            })
    })
    .post('/new-employee', function(req, res) {
        var companyid = req.body.companyid;
        var companyname = req.body.companyname;
        var branchid = req.body.branchid;
        var branchname = req.body.branchname;
        var branchcity = req.body.branchcity;
        var managerid = req.body.managerid;
        var managername = req.body.managername;
        var managerrole = req.body.managerrole;

        var newEmployee = new Employee({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            // directManager: req.body.directManager,
            designation: req.body.designation,
            employeeEmail: req.body.employeeEmail,
            personalEmail: req.body.personalEmail,
            password: req.body.password,
            department: req.body.department,
            dateOfBirth: req.body.dateOfBirth,
            bloodGroup: req.body.bloodGroup,
            gender: req.body.gender,
            aadharNumber: req.body.aadharNumber,
            panNumber: req.body.panNumber,
            visaType: req.body.visaType,
            maritalStatus: req.body.maritalStatus,
            currentAddress: req.body.currentAddress,
            permanentAddress: req.body.permanentAddress,
            employeeRole: req.body.employeeRole,
            reportingTo: {
                managerId: managerid,
                managerName: managername,
                role: managerrole
            },
            branch: {
                branchId: branchid,
                branchName: branchname,
                branchCity: branchcity
            },
            company: {
                companyId: companyid,
                companyName: companyname
            }
        })

        newEmployee
            .save()
            .then(function (data) {
                // console.log(data);
                res.status(201).json({
                    message: 'New employee created',
                    employeeData: data
                })
            })
            .catch(function (err) {
                console.log('Error creating an employee    ', err);
                res.status(500).json({
                    message: 'Error faced',
                    data: err
                })
            })
    });

module.exports = router;