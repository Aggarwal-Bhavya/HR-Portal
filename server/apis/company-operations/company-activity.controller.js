var Company = require('../company-operations/company.model');
var Employee = require('../../models/employee');

var companyActivity = {
    createCompany: function (req, res) {
        console.log(req.body)
        // var companyAndAdminData = req.body;
        var newCompany = new Company({
            companyName: req.body.companyName,
            companyLogo: req.body.companyLogo,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            companyWebsite: req.body.companyWebsite,
        });

        newCompany
            .save()
            .then(function (data) {
                // console.log(data);
                
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
    },

    getAllActiveCompanies: function (req, res) {
        Company
            .find({isActive: true})
            .sort({createdAt: -1})
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
    },

    getAllInactiveCompanies: function (req, res) {
        Company
            .find({isActive: false})
            .sort({createdAt: -1})
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
    },

    getSpecificCompany: function (req, res) {
        var id = req.params.id;

        Company
            .findById(
                {
                    _id: id
                })
            .then(function (item) {
                // console.log(item);
                res.status(201).json({
                    message: 'Company data found',
                    companyData: item
                })
            })
            .catch(function (err) {
                console.log('get specific company error   ', err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    },

    updateSpecificCompany: function (req, res) {
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
    },

    deactivateCompany: function (req, res) {
        var id = req.params.id;

        Company
            .findByIdAndUpdate({
                _id: id
            }, {
                $set: { 
                    isActive: false,
                    dateOfLeaving: Date.now()
                }
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
    },

    activateCompany: function (req, res) {
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
    }
};

module.exports = companyActivity;