var Employee = require("../employee-operations/employee.model");
var Branch = require("../branch-operations/branch.model");

var employeeActivity = {
    getBranchEmployees: function (req, res) {
        var id = req.params.id;
        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

        Employee
            .find({
                $and: [
                    { "branch.branchId": id },
                    { isActive: true },
                    {
                        $or: [
                            { employeeRole: "departmenthead" },
                            { employeeRole: "employee" },
                            { employeeRole: "hradmin" }
                        ]
                    }
                ]
            })
            .then(function (item) {
                var paginatedData = item.slice(startIndex, endIndex);
                res.status(201).json({
                    message: 'All employees of this branch are ',
                    branchData: paginatedData,
                    totalCount: item.length
                })
            })
            .catch(function (err) {
                console.log('Error in fetching branch employee info   ', err);
                res.status(500).json({
                    message: 'Branch employee error  ',
                    data: err
                })
            })
    },

    getBranchDepartmentHeads: function (req, res) {
        var id = req.params.id;
        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;
        Employee
            .find({
                $and: [
                    {
                        $or: [
                            { employeeRole: "departmenthead" },
                            { employeeRole: "hradmin" }
                        ]
                    },
                    { "reportingTo.role": "branchadmin" },
                    { isActive: true },
                    { "branch.branchId": id }
                ]
            })
            .then(function (item) {
                // console.log(item)
                var paginatedData = item.slice(startIndex, endIndex);
                res.status(201).json({
                    message: "Department heads of this branch are",
                    departmentHeads: paginatedData,
                    totalCount: item.length
                })
            })
            .catch(function (err) {
                console.log("Error in finding department heads   ", err);
                res.status(500).json({
                    message: "Department head data fetch error",
                    data: err
                })
            })
    },

    getPreviousBranchEmployees: function (req, res) {
        var id = req.params.id;
        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;
        Employee
            .find({
                $and: [
                    { "branch.branchId": id },
                    { isActive: false }
                ]
            })
            .then(function (item) {
                var paginatedData = item.slice(startIndex, endIndex);
                res.status(201).json({
                    message: 'All previous employees of this branch are ',
                    previousEmployeesData: paginatedData,
                    totalCount: item.length
                })
            })
            .catch(function (err) {
                console.log('Error in fetching previous branch employees info   ', err);
                res.status(500).json({
                    message: 'Branch employee error  ',
                    data: err
                })
            })
    },

    getSpecificEmployee: function (req, res) {
        var id = req.params.id;

        Employee
            .findById({
                _id: id
            })
            .then(function (item) {
                // console.log(item)
                res.status(201).json({
                    message: 'Employee data found',
                    employeeData: item
                })
            })
            .catch(function (err) {
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    },

    updateSpecificEmployee: function (req, res) {
        var id = req.params.id;
        // console.log(req.body);
        var updateEmployee = {
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
            'personalDetails.currentAddress.pincode': req.body.personalDetails.currentAddress.pincode,
            'employeeDetails.designation': req.body.employeeDetails.designation,
            employeeRole: req.body.employeeRole
        }

        Employee
            .updateOne(
                { _id: id },
                updateEmployee,
                // { $set: updateEmployee },
                { new: true }
            )
            .then(function (item) {
                res.status(201).json({
                    message: 'Updated employee information',
                    employeeData: item
                })
            })
            .catch(function (err) {
                console.log('Error in updating employee info    ', err);
                res.status(500).json({
                    message: 'Employee information update fail',
                    data: err
                })
            })
    },

    getAllCompanyEmployees: function (req, res) {
        var id = req.params.id;
        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

        Employee
            .find({
                $and: [
                    { "company.companyId": id },
                    { isActive: true },
                    {
                        $or: [
                            { employeeRole: "departmenthead" },
                            { employeeRole: "employee" },
                            { employeeRole: "hradmin" }
                        ]
                    }
                ]
            })
            .then(function (item) {
                var paginatedData = item.slice(startIndex, endIndex);
                res.status(201).json({
                    message: 'All employees of this company are ',
                    companyData: paginatedData,
                    totalCount: item.length
                })
            })
            .catch(function (err) {
                console.log('Error in fetching branch employee info   ', err);
                res.status(500).json({
                    message: 'Branch employee error  ',
                    data: err
                })
            })
    }
};

module.exports = employeeActivity;