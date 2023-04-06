var Employee = require("../employee-operations/employee.model");
var bcrypt = require("bcrypt");

function hashPassword(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return { salt, hash };
}

var branchAdminActions = {
    getBranchAdminInfo: function (req, res) {
        var id = req.params.id;

        Employee
            .findOne({
                $and: [
                    { employeeRole: "branchadmin" },
                    { isActive: true },
                    { "branch.branchId": id }
                ]
            })
            .then(function (item) {
                console.log(item);
                res.status(201).json({
                    message: "branch admin found",
                    adminData: item
                })
            })
            .catch(function (err) {
                console.log('Error in fecthing branch admin info    ', err);
                res.status(500).json({
                    message: 'Error fetchimg branch admin info',
                    data: err
                })
            })
    },

    updateBranchAdmin: function (req, res) {
        var branchid = req.body.branchid;
        var companyid = req.body.companyid;
        var updateBranchAdmin = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            'personalDetails.contact.personalEmail': req.body.personalDetails.contact.personalEmail,
            'personalDetails.contact.phoneNumber': req.body.personalDetails.contact.phoneNumber,
            'personalDetails.dateOfBirth': req.body.personalDetails.dateOfBirth,
            'personalDetails.bloodGroup': req.body.personalDetails.bloodGroup,
            'personalDetails.gender': req.body.personalDetails.gender,
            'personalDetails.aadharNumber': req.body.personalDetails.aadharNumber,
            'personalDetails.panNumber': req.body.personalDetails.panNumber,
            'personalDetails.currentAddress.street': req.body.personalDetails.currentAddress.street,
            'personalDetails.currentAddress.city': req.body.personalDetails.currentAddress.city,
            'personalDetails.currentAddress.pincode': req.body.personalDetails.currentAddress.pincode
        };

        Employee
            .findOneAndUpdate(
                {
                    $and: [
                        { employeeRole: "branchadmin" },
                        { isActive: true },
                        { "company.companyId": companyid },
                        { "branch.branchId": branchid }
                    ]
                },
                { $set: updateBranchAdmin },
                { new: true }
            )
            .then(function (item) {
                res.status(201).json({
                    message: 'branch admin info updated successfully',
                    data: item
                })
            })
            .catch(function (err) {
                console.log("Error updating branch admin info   ", err)
                res.status(500).json({
                    message: 'branch admin info update failed',
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
                { $and: [{ employeeRole: "branchadmin" }, { isActive: true }, { _id: id }] },
                {
                    $set: {
                        password: password,
                        passwordHash: hash,
                        passwordSalt: salt
                    }
                },
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

module.exports = branchAdminActions;