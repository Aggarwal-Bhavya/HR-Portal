var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');
var Company = require('../models/company');
var Branch = require('../models/branch');

// 1. Fetching branch info 
// 2. Adding employee info
// 3. Managing employee info
// 4. View team wise info for employees of a branch
// 5. View direct managers for a team or department info
// 6. Fetching and updating branch admin info

router
    .get('/branch-info/:id', function(req, res) {
        var id = req.params.id;
        Branch
            .findById({ _id: id })
            .then(function (item) {
                // console.log(item);
                res.status(201).json({
                    message: 'Branch info found',
                    branchData: item 
                })
            })
            .catch(function(err) {
                console.log('Error in getting branch info   ', err);
                res.status(500).json({
                    message: 'Error in brand info',
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
                console.log(data);
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
    })
    .get('/all-employees/:id', function(req, res) {
        var id = req.params.id;
        Employee
            .find({
                "branch.branchId": id
            })
            .then(function(item) {
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
    .get('/department-heads/:id', function(req, res) {
        var id = req.params.id;
        Employee
            .find({
                $and: [
                    { $or: [
                        { employeeRole: "departmenthead"},
                        { employeeRole: "hradmin" }
                    ] },
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
    .get('/branch-admin-info/:id', function(req, res) {
        var id = req.params.id;

        Employee
            .findOne({
                $and: [
                    { employeeRole: "branchadmin" },
                    { isActive: true },
                    { "branch.branchId": id }
                ]
            })
            .then(function(item) {
                res.status(201).json({
                    message: "branch admin found",
                    adminData: item
                })
            })
            .catch(function(err) {
                console.log('Error in fecthing branch admin info    ', err);
                res.status(500).json({
                    message: 'Error fetchimg branch admin info',
                    data: err
                })
            })
    })
    .put('/update-branchadmin', function(req, res) {
        var branchid = req.body.branchid;
        var companyid = req.body.companyid;
        var updateBranchAdmin = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            personalEmail: req.body.personalEmail,
            password: req.body.password,
            maritalStatus: req.body.maritalStatus,
            currentAddress: req.body.currentAddress
        };

        Employee
            .findOneAndUpdate(
                { $and: [ 
                    {employeeRole: "branchadmin" }, 
                    { isActive: true }, 
                    { "company.companyId": companyid},
                    { "branch.branchId" : branchid }
                ] },
                { $set: updateBranchAdmin },
                { new: true}
            )
            .then(function(item) {
                res.status(201).json({
                    message: 'branch admin info updated successfully',
                    data: item
                })
            })
            .catch(function(err) {
                console.log("Error updating branch admin info   ", err)
                res.status(500).json({
                    message: 'branch admin info update failed',
                    data: err
                })
            })
    })
    .get('/employee-info/:id', function(req, res) {
        var id = req.params.id;

        Employee
            .findById({
                _id: id
            })
            .then(function(item) {
                // console.log(item)
                res.status(201).json({
                    message: 'Employee data found',
                    employeeData: item
                })
            })
            .catch(function(err) {
                res.status(500).json({
                    message: 'Error',
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
    });

module.exports = router;