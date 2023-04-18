var Company = require('../company-operations/company.model');
var Employee = require('../employee-operations/employee.model');
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var crypto = require("crypto");
var nodemailer = require("nodemailer");

function hashPassword(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return { salt, hash };
}

function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

function sendMail(employeeEmail, password) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'aggarwal.bhavya57@gmail.com',
            pass: 'ojgqmtrditwvbvor',
        },
    });

    var mailOptions = {
        from: 'aggarwal.bhavya57@gmail.com',
        to: employeeEmail,
        subject: 'Account Created',
        html: `<p><strong>Congratulations!</strong></p><br>You are the new company admin. The password for your account is <strong>${password}<strong>. <br>Please log in and change it.`
    }

    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            console.log('Error sending mail', err)
        } else {
            console.log('Email sent successfully!')
        }
    })
}



var companyActivity = {
    // createCompany: async function (req, res) {
    //     var session = await mongoose.startSession();

    //     try {
    //         session.startTransaction();

    //         var newCompany = new Company({
    //             companyName: req.body.companyName,
    //             companyLogo: req.body.companyLogo,
    //             email: req.body.email,
    //             phoneNumber: req.body.phoneNumber,
    //             companyWebsite: req.body.companyWebsite,
    //         });

    //         var savedCompany = await newCompany.save({ session });

    //         var password = generateRandomString(10);
    //         var { salt, hash } = hashPassword(password);
    //         var companyAdmin = new Employee({
    //             firstName: req.body.firstName,
    //             lastName: req.body.lastName,
    //             password: password,
    //             passwordHash: hash,
    //             passwordSalt: salt,
    //             personalDetails: {
    //                 contact: {
    //                     personalEmail: req.body.personalEmail,
    //                     phoneNumber: req.body.personalPhoneNumber
    //                 },
    //                 gender: req.body.gender,
    //             },
    //             employeeDetails: {
    //                 employeeEmail: req.body.employeeEmail,
    //                 designation: "Company Admin",
    //             },
    //             employeeRole: "companyadmin",
    //             company: {
    //                 companyId: savedCompany._id,
    //                 companyName: savedCompany.companyName
    //             }
    //         });

    //         await companyAdmin.save({ session });
    //         await session.commitTransaction();

    //         res.status(201).json({
    //             message: 'Company and admin created successfully',
    //             data: req.body,
    //             company: savedCompany,
    //             user: companyAdmin,
    //         });
    //     } catch (error) {
    //         await session.abortTransaction();
    //         console.log('Transaction aborted   ', error);

    //         res.status(500).json({
    //             message: 'Error',
    //             data: error
    //         });
    //     } finally {
    //         session.endSession();
    //     }
    // },

    createCompany: function (req, res) {
        var newCompany = new Company({
            companyName: req.body.companyName,
            companyLogo: req.body.companyLogo,
            companyWebsite: req.body.companyWebsite,
        });

        if (req.body.email) {
            var emailArr = req.body.email.split(',');
            emailArr.forEach(function (email) {
                newCompany.email.push(email.trim());
            });
        }

        if (req.body.phoneNumber) {
            var phoneArr = req.body.phoneNumber.split(',');
            phoneArr.forEach(function (phone) {
                newCompany.phoneNumber.push(phone.trim());
            });
        }

        newCompany
            .save()
            .then(function (data) {
                // console.log(data);
                var password = generateRandomString(10);
                var { salt, hash } = hashPassword(password);
                var companyAdmin = new Employee({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: password,
                    passwordHash: hash,
                    passwordSalt: salt,
                    personalDetails: {
                        contact: {
                            personalEmail: req.body.personalEmail,
                            phoneNumber: req.body.personalPhoneNumber
                        },
                        gender: req.body.gender,
                    },
                    employeeDetails: {
                        employeeEmail: req.body.employeeEmail,
                        designation: "Company Admin",
                    },
                    employeeRole: "companyadmin",
                    company: {
                        companyId: data._id,
                        companyName: data.companyName
                    }
                });

                companyAdmin
                    .save()
                    .then(function (item) {
                        sendMail(item.employeeDetails.employeeEmail, password);
                        res.status(201).json({
                            message: 'Company and admin created successfully',
                            data: req.body,
                            company: data,
                            user: item,

                        })
                    })
                    .catch(function (err) {
                        console.log("company admin error   ", err);

                        Company
                            .findByIdAndDelete({_id: data._id})
                            .then( function (item) {
                                res.status(200).json({
                                    message: 'Error creating company admin so rolled back',
                                    data: item
                                })
                            })
                            .catch(function (err) {
                                res.status(500).json({
                                    message: 'Could not rollback for admin',
                                    data: err
                                })
                            })
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
        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

        Company
            .find({ isActive: true })
            .sort({ createdAt: -1 })
            .then(function (item) {
                var paginatedData = item.slice(startIndex, endIndex);

                res.status(201).json({
                    message: 'View all companies',
                    companyData: paginatedData,
                    totalCount: item.length
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
        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

        Company
            .find({ isActive: false })
            .sort({ createdAt: -1 })
            .then(function (item) {
                var paginatedData = item.slice(startIndex, endIndex);

                res.status(201).json({
                    message: 'View all companies',
                    companyData: paginatedData,
                    totalCount: item.length
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