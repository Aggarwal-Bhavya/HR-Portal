var express = require('express');
var router = express.Router();
var Company = require('../models/company');
const Employee = require('../models/employee');

// Super Admin can:
// 1. login using credentials
// 2. create company and its corresponding admin
// 3. update some fields of its own data
// 4. view companies whose account it holds and specific company via their id
// 5. update specific contents of company data
// 6. soft delete a company account
// router.get('/login')


router
    .get('/superadmin-info', function (req, res) {
        Employee
            .findOne(
                {
                    $and: [{ employeeRole: "superadmin" }, { isActive: true }]
                })
            .then(function (item) {
                console.log(item);
                res.status(201).json({
                    message: 'super admin found',
                    adminData: item
                })
            })
            .catch(function (err) {
                console.log('Error in super admin find   ', err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    })
    .put('/update-info', function (req, res) {
        var updateSuperAdmin = {
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
                { $and: [{ employeeRole: "superadmin" }, { isActive: true }] },
                { $set: updateSuperAdmin }
            )
            .then(function (item) {
                res.status(201).json({
                    message: 'user info updated',
                    data: item
                })
            })
            .catch(function (err) {
                console.log('error could not update super admin   ', err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    })
    .post('/create-company', function (req, res) {
        console.log(req.body)
        // var companyAndAdminData = req.body;
        var newCompany = new Company({
            companyName: req.body.companyName,
            companyLogo: req.body.companyLogo,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            companyWebsite: req.body.companyWebsite,
        });

        // var companyAdmin = new Employee({
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     employeeEmail: req.body.employeeEmail,
        //     personalEmail: req.body.personalEmail,
        //     password: req.body.password,
        //     department: "rda",
        //     bloodGroup: "rda",
        //     gender: "rda",
        //     currentAddress: "rda",
        //     permanentAddress: "rda",
        //     employeeRole: "companyadmin",
        //     aadharNumber: req.body.aadharNumber
        // });

        newCompany
            .save()
            .then(function (data) {
                console.log(data);
                
                var companyAdmin = new Employee({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    employeeEmail: req.body.employeeEmail,
                    personalEmail: req.body.personalEmail,
                    password: req.body.password,
                    department: "rda",
                    bloodGroup: "rda",
                    gender: "rda",
                    currentAddress: "rda",
                    permanentAddress: "rda",
                    employeeRole: "companyadmin",
                    aadharNumber: req.body.aadharNumber,
                    company: {
                        companyId: data._id,
                        companyName: data.companyName
                    }
                });

                companyAdmin
                    .save()
                    .then(function (item) {
                        res.status(201).json({
                            message: 'Company and admin created successfully',
                            data: req.body,
                            company: data,
                            user: item,

                        })
                    })
                    .catch(function (err) {
                        console.log("company admin error   ", err);
                        res.status(500).json({
                            // message: 'Error',
                            error: err
                        });
                    })
            })
            .catch(function (err) {
                console.log("company error", err);
                res.status(500).json({
                    // message: 'Error',
                    error: err
                });
            });
    })
    .get('/all-companies', function (req, res) {
        Company
            .find({})
            .then(function (item) {
                res.status(201).json({
                    message: 'View all companies',
                    companyData: item
                })
            })
            .catch(function (err) {
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    })
    .get('/company/:id', function (req, res) {
        var id = req.params.id;

        Company
            .findById(
                {
                    _id: id
                })
            .then(function (item) {
                console.log(item);
                res.status(201).json({
                    message: 'Company data found',
                    companyData: item
                })
            })
            .catch(function (err) {
                console.log('get specific comapny error   ', err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    })
    .put('/update-company-info/:id', function (req, res) {
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
            })
            .then(function (data) {
                res.status(201).json({
                    message: 'Company info updated',
                    data: data
                })
            })
            .catch(function (err) {
                console.log("Comapny Info update error   ", err);
                res.status(500).json({
                    // message: 'Error',
                    data: err
                })
            })
    })
    .put('/deactivate-company/:id', function (req, res) {
        var id = req.params.id;

        Company
            .findByIdAndUpdate({
                _id: id
            }, {
                $set: { isActive: false }
            })
            .then(function (item) {
                res.status(201).json({
                    message: 'Company info updated',
                    data: item
                })
            })
            .catch(function (err) {
                console.log('Error in  deactivating company   ', err);
                res.status(500).json({
                    data: err
                })
            })
    })
    .put('/activate-company/:id', function (req, res) {
        var id = req.params.id;

        Company
            .findByIdAndUpdate({
                _id: id
            }, {
                $set: { isActive: true }
            })
            .then(function (item) {
                res.status(201).json({
                    message: 'Company info updated',
                    data: item
                })
            })
            .catch(function (err) {
                console.log('Error in  activating company   ', err);
                res.status(500).json({
                    data: err
                })
            })
    });

module.exports = router;
