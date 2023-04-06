var Employee = require('../employee-operations/employee.model');
var bcrypt = require("bcrypt");

function hashPassword(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return { salt, hash };
}

var comapnyAdminActions = {
    getCompanyAdminInfo: function (req, res) {
        var id = req.params.id;
        Employee
            .findOne({
                $and: [{ employeeRole: "companyadmin" },
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
    },

    updateCompanyAdminInfo: function (req, res) {
        var id = req.body.id;
        var updateCompanyAdmin = {
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
                }
            }
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
    },

    changePassword: function (req, res) {
        var id = req.body.id;
        var password = req.body.password;
        // console.log(password);
        var { salt, hash } = hashPassword(password);

        Employee
            .findOneAndUpdate(
                { $and: [{ employeeRole: "companyadmin" }, { isActive: true }, { "company.companyId": id }] },
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

module.exports = comapnyAdminActions;