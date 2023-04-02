var Employee = require("../../models/employee");

var comapnyAdminActions = {
    getCompanyAdminInfo: function(req, res) {
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
    },

    updateCompanyAdminInfo: function(req, res) {
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
    }
};

module.exports = comapnyAdminActions;