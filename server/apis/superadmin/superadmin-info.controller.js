var Employee = require('../employee-operations/employee.model');
var bcrypt = require("bcrypt");

function hashPassword(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return { salt, hash };
}

var infoActivity = {
    viewInfo: function (req, res) {
        Employee
            .findOne(
                {
                    $and: [{ employeeRole: "superadmin" }, { isActive: true }]
                },
                {
                    employeeDetails: 1,
                    firstName: 1,
                    lastName: 1,
                    personalDetails: 1
                })
            .then(function (item) {
                // console.log(item);
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
    },

    updateInfo: function (req, res) {
        var updateSuperAdmin = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            personalDetails: {
                contact: {
                    personalEmail: req.body.personalDetails.contact.personalEmail,
                    phoneNumber: req.body.personalDetails.contact.phoneNumber
                },
                dateOfBirth: req.body.personalDetails.dateOfBirth,
                bloodGroup: req.body.personalDetails.bloodGroup,
                gender: req.body.personalDetails.gender,
                aadharNumber: req.body.personalDetails.aadharNumber,
                panNumber: req.body.personalDetails.panNumber,
                currentAddress: {
                    street: req.body.personalDetails.currentAddress.street,
                    city: req.body.personalDetails.currentAddress.city,
                    pincode: req.body.personalDetails.currentAddress.pincode
                },
            }
        }

        // console.log(updateSuperAdmin);
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
    },

    changePassword: function (req, res) {
        var password = req.body.password;
        // console.log(password);
        var { salt, hash } = hashPassword(password);

        Employee
            .findOneAndUpdate(
                { $and: [{ employeeRole: "superadmin" }, { isActive: true }] },
                { $set: {
                    password: password,
                    passwordHash: hash,
                    passwordSalt: salt
                } }
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

module.exports = infoActivity;