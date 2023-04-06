// var Employee = require("../../models/employee");
var Employee = require("./employee.model");
var crypto = require("crypto");
var bcrypt = require("bcrypt");
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
        subject: 'HRMS Account Access',
        html: `<p><strong>Congratulations!</strong></p><br>You have been given access to HRMS. The password for your account is <strong>${password}<strong>. <br>Please log in and change it.`
    }

    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            console.log('Error sending mail', err)
        } else {
            console.log('Email sent successfully!')
        }
    })
}


// function generateEmployeeId() {
//     const length = 7;
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';

//     for (let i = 0; i < length; i++) {
//         result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }

//     return result;
// }


var createEmployee = {
    createEmployee: function (req, res) {
        var companyid = req.body.companyid;
        var companyname = req.body.companyname;
        var branchid = req.body.branchid;
        var branchname = req.body.branchname;
        var branchcity = req.body.branchcity;
        var managerid = req.body.managerid;
        var managername = req.body.managername;
        var managerrole = req.body.managerrole;

        var password = generateRandomString(10);
        var { salt, hash } = hashPassword(password);
        var newEmployee = new Employee({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: password,
            passwordHash: hash,
            passwordSalt: salt,
            personalDetails: {
                contact: {
                    personalEmail: req.body.personalEmail,
                    phoneNumber: req.body.phoneNumber
                },
                dateOfBirth: req.body.dateOfBirth,
                bloodGroup: req.body.bloodGroup,
                gender: req.body.gender,
                aadharNumber: req.body.aadharNumber,
                panNumber: req.body.panNumber,
                // currentAddress: {
                //     street: req.body.street,
                //     city: req.body.city,
                //     pincode: req.body.pincode
                // },
                permanentAddress: {
                    street: req.body.pStreet,
                    city: req.body.pCity,
                    pincode: req.body.pPincode
                }
            },
            employeeDetails: {
                employeeEmail: req.body.employeeEmail,
                designation: req.body.designation,
                department: req.body.department,
            },
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
                sendMail(data.employeeDetails.employeeEmail, password);
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
    },

    removeEmployee: function (req, res) {
        var id = req.params.id;

        Employee
            .findByIdAndUpdate(
                { _id: id },
                {
                    $set:
                    {
                        isActive: false,
                        'employeeDetails.dateOfLeaving': Date.now()
                    }
                }
            )
            .then(function (item) {
                res.status(201).json({
                    message: 'Employee removed'
                })
            })
            .catch(function (err) {
                console.log('Error removing employee   ', err);
                res.status(500).json({
                    message: 'Error removing employee',
                    data: err
                })
            })
    },

    changePassword: function (req, res) {
        var id = req.body.id;
        var password = req.body.password;
        // console.log(password);
        var { salt, hash } = hashPassword(password);

        Employee
            .findOneAndUpdate(
                { $and: [{ _id: id }, { isActive: true }] },
                { $set: {
                    password: password,
                    passwordHash: hash,
                    passwordSalt: salt
                } },
                {
                    employeeDetails: 1
                }
            )
            .then(function (item) {
                // res.send("success")
                res.status(201).json({
                    message: 'success',
                    data: item
                })
            })
            .catch(function (err) {
                console.log('Error changing password   ', err);
                res.status(500).json({
                    message: 'Error changing password',
                    data: err
                })
            })
    }
};

module.exports = createEmployee;