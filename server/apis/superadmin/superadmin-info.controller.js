var Employee = require('../../models/employee');

var infoActivity = {
    viewInfo: function (req, res) {
        Employee
            .findOne(
                {
                    $and: [{ employeeRole: "superadmin" }, { isActive: true }]
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
    }
};

module.exports = infoActivity;