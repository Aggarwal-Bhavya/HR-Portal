var Employee = require("../../models/employee");

var branchAdminActions = {
    getBranchAdminInfo: function(req, res) {
        var id = req.params.id;

        Employee
            .findOne({
                $and: [
                    { employeeRole: "branchadmin" },
                    { isActive: true },
                    { "branch.branchId": id }
                ]
            })
            .then(function(item) {
                res.status(201).json({
                    message: "branch admin found",
                    adminData: item
                })
            })
            .catch(function(err) {
                console.log('Error in fecthing branch admin info    ', err);
                res.status(500).json({
                    message: 'Error fetchimg branch admin info',
                    data: err
                })
            })
    },

    updateBranchAdmin: function(req, res) {
        var branchid = req.body.branchid;
        var companyid = req.body.companyid;
        var updateBranchAdmin = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            personalEmail: req.body.personalEmail,
            password: req.body.password,
            maritalStatus: req.body.maritalStatus,
            currentAddress: req.body.currentAddress
        };

        Employee
            .findOneAndUpdate(
                { $and: [ 
                    {employeeRole: "branchadmin" }, 
                    { isActive: true }, 
                    { "company.companyId": companyid},
                    { "branch.branchId" : branchid }
                ] },
                { $set: updateBranchAdmin },
                { new: true}
            )
            .then(function(item) {
                res.status(201).json({
                    message: 'branch admin info updated successfully',
                    data: item
                })
            })
            .catch(function(err) {
                console.log("Error updating branch admin info   ", err)
                res.status(500).json({
                    message: 'branch admin info update failed',
                    data: err
                })
            })
    }
};

module.exports = branchAdminActions;