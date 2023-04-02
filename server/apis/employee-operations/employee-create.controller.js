var Employee = require("../../models/employee");

var createEmployee = {
    createEmployee: function(req, res) {
        var companyid = req.body.companyid;
        var companyname = req.body.companyname;
        var branchid = req.body.branchid;
        var branchname = req.body.branchname;
        var branchcity = req.body.branchcity;
        var managerid = req.body.managerid;
        var managername = req.body.managername;
        var managerrole = req.body.managerrole;

        var newEmployee = new Employee({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            designation: req.body.designation,
            employeeEmail: req.body.employeeEmail,
            personalEmail: req.body.personalEmail,
            password: req.body.password,
            department: req.body.department,
            dateOfBirth: req.body.dateOfBirth,
            bloodGroup: req.body.bloodGroup,
            gender: req.body.gender,
            aadharNumber: req.body.aadharNumber,
            panNumber: req.body.panNumber,
            visaType: req.body.visaType,
            maritalStatus: req.body.maritalStatus,
            currentAddress: req.body.currentAddress,
            permanentAddress: req.body.permanentAddress,
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

    removeEmployee: function(req, res) {
        var id = req.params.id;

        Employee
            .findByIdAndUpdate(
                { _id: id }, 
                { $set: 
                    { 
                        isActive: false,
                        dateOfLeaving: Date.now()
                    }
                }
            )
            .then(function(item) {
                res.status(201).json({
                    message: 'Employee removed'
                })
            })
            .catch(function(err) {
                console.log('Error removing employee   ', err);
                res.status(500).json({
                    message: 'Error removing employee', 
                    data: err
                })
            })
    }
};

module.exports = createEmployee;