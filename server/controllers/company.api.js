var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');
var Company = require('../models/company');
var Branch = require('../models/branch');

// 1. Fetching company specific info
// 2. Creating branches and branch manager
// 3. Updating company info
// 4. Updating company admin info
// 5. Fetching all branches related to company id
// 6. Deactivating company account

router
    .get('/company-info/:id', function(req, res) {
        var id = req.params.id;
        Company
            .findById({ _id: id})
            .then(function(item) {
                // console.log(item);
                res.status(201).json({
                    message: 'Company Info',
                    companyData: item
                })
            })
            .catch(function(err) {
                console.log('Error in company info    ', err);
                res.status(500).json({
                    message: 'Error found',
                    data: err
                })
            })
    })
    .put('/update-company-info/:id', function(req, res) {
        var id = req.params.id;

        var updateCompany = {
            companyName: req.body.companyName,
            companyLogo: req.body.companyLogo,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            companyWebsite: req.body.companyWebsite
        }

        Company
            .findByIdAndUpdate(
                {
                    _id: id
                }, {
                    $set: updateCompany
                }, {
                    new: true
                })
                .then(function (data) {
                    res.status(201).json({
                        message: 'Company Info updated',
                        data: data
                    })
                })
                .catch(function(err) {
                    console.log("company Info update error   ", err);
                    res.status(500).json({
                        // message: err,
                        data: err
                    })
                })
    })
    .get('/all-branches/:id', function(req, res) {
        var id = req.params.id;
        Branch
            .find({
                "company.companyId": id
            })
            .then(function(item) {
                // console.log(item)
                res.status(201).json({
                    message: 'All brances are: ',
                    branchData: item
                })
            })
            .catch(function(err) {
                console.log("Error in fetching branch info   ", err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    })
    .post('/create-branch', function(req, res) {
        console.log(req.body);
        var id = req.body.id;
        var companyName = req.body.companyName;
        var newBranch = new Branch({
            branchName: req.body.branchName,
            departments: req.body.departments,
            address: req.body.address,
            city: req.body.city,
            contactNumber: req.body.contactNumber,
            company: {
                companyId: id,
                companyName: companyName
            }
        });

        newBranch
            .save()
            .then(function (data) {
                var branchAdmin = new Employee({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    employeeEmail: req.body.employeeEmail,
                    personalEmail: req.body.personalEmail,
                    password: req.body.password,
                    department: "rda",
                    bloodGroup: "rda",
                    gender: "rda",
                    maritalStatus: "rda",
                    currentAddress: "rda",
                    permanentAddress: "rda",
                    employeeRole: "branchadmin",
                    aadharNumber: req.body.aadharNumber,
                    company: {
                        companyId: data.company.companyId,
                        companyName: data.company.companyName
                    },
                    branch: {
                        branchId: data._id,
                        branchName: data.branchName,
                        branchCity: data.city
                    }
                });

                branchAdmin
                    .save()
                    .then(function(item) {
                        res.status(201).json({
                            message: 'Branch and admin created successfully',
                            data: req.body,
                            branch: data,
                            admin: item
                        })
                    })
                    .catch(function(err) {
                        console.log("branch admin error    ", err);
                        res.status(500).json({
                            message: err
                        })
                    })
            })
            .catch(function (err) {
                console.log("branch creation error    ", err);
                res.status(500).json({
                    message: err
                })
            })
    })
    .get('/company-admin-info/:id', function(req, res) {
        var id = req.params.id;
        Employee
            .findOne({
                $and: [ { employeeRole: "companyadmin" }, 
                        { isActive: true },
                        { "company.companyId": id }
                    ]
            })
            .then(function (item) {
                // console.log(item);
                res.status(201).json({
                    message: 'company admin found',
                    adminData: item
                })
            })
            .catch(function (err) {
                console.log('Error in fetching company admin info   ', err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    })
    .put('/update-companyadmin', function(req, res) {
        var id = req.body.id;
        var updateCompanyAdmin = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            personalEmail: req.body.personalEmail,
            password: req.body.password,
            maritalStatus: req.body.maritalStatus,
            currentAddress: req.body.currentAddress
        }

        Employee
            .findOneAndUpdate(
                { $and: [{ employeeRole: "companyadmin" }, { isActive: true }, { "company.companyId": id }] },
                { $set: updateCompanyAdmin },
                { new: true }
            )
            .then(function (item) {
                // console.log(item);
                res.status(201).json({
                    message: 'company admin info updated',
                    data: item
                })
            })
            .catch(function (err) {
                console.log('Company admin update error   ', err);
            })
    })
    .get('/branch/:id', function(req, res) {
        var id = req.params.id;
        
        Branch
            .findById({
                _id: id
            })
            .then(function(item) {
                res.status(201).json({
                    message: 'Branch data found',
                    branchData: item
                })
            })
            .catch(function(err) {
                console.log('get specific branch error    ', err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    })
    .put('/update-branch-info/:id', function(req, res) {
        var id = req.params.id;

        var updateBranch = {
            branchName: req.body.branchName,
            departments: req.body.departments,
            address: req.body.address,
            city: req.body.city,
            contactNumber: req.body.contactNumber
        }

        Branch
            .findByIdAndUpdate( 
                { _id: id },
                { $set: updateBranch },
                { new: true }
            )
            .then(function(item) {
                res.status(201).json({
                    message: 'Branch info updated',
                    branchData: item
                })
            })
            .catch(function(err) {
                console.log("Branch info update error    ", err);
                res.status(500).json({
                    message: 'Branch update error',
                    data: err
                })
            })
    })
    .get('/all-branch-heads/:id', function(req, res) {
        var id = req.params.id;

        Employee
            .find({ 
                $and: [
                    { isActive: true },
                    { employeeRole: "branchadmin" },
                    { "company.companyId": id }
                ]
            })
            .then(function(item) {
                // console.log(item);
                res.status(201).json({
                    message: 'Branch Head Information',
                    branchHeads: item
                })
            })
            .catch(function(err) {
                console.log('Brand admin info fetch error     ', err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    });

module.exports = router;