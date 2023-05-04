var Employee = require("../employee-operations/employee.model");
var Branch = require("../branch-operations/branch.model");
var createCsvWriter = require('csv-writer').createArrayCsvWriter;

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
    },

    filterEmployees: function (req, res) {
        var statusValue = req.query.statusValue
        var startDateValue = req.query.startDateValue ? new Date(req.query.startDateValue) : new Date(new Date().getFullYear(), 0, 1);
        var endDateValue = req.query.endDateValue ? new Date(req.query.endDateValue) : new Date();
        var name = req.query.bName ? new RegExp(req.query.bName, 'i') : undefined;
        var department = req.query.bDepartment ? new RegExp(req.query.bDepartment, 'i') : undefined;

        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

        var query = {};

        if (statusValue !== undefined) {
            if (statusValue === 'active') {
                query.isActive = true;
            } else if (statusValue === 'inactive') {
                query.isActive = false;
            }
        }

        if (startDateValue !== undefined && endDateValue !== undefined) {
            if (endDateValue < startDateValue) {
                res.status(400).json({
                    message: 'Invalid date range',
                    data: null
                })
                return;
            }
            query.createdAt = { $gt: startDateValue, $lt: endDateValue };
        }

        if (name !== undefined) {
            query['branch.branchName'] = { $regex: name }
        }

        if (department !== undefined) {
            query['employeeDetails.department'] = { $regex: department }
        }

        query.employeeRole = { $in: ["branchadmin", "seniorhr", "departmenthead", "employee"] }

        Employee
            .find(query)
            .then(function (item) {
                var paginatedData = item.slice(startIndex, endIndex);

                // console.log(item.length);
                // console.log(item)

                res.status(201).json({
                    message: 'Filtered employee data',
                    companyData: paginatedData,
                    totalCount: item.length
                })

            })
            .catch(function (err) {
                console.log(err);

                res.status(500).json({
                    message: 'Error filtering data',
                    data: err
                })
            })
    },

    filterEmployeeRoles: function (req, res) {
        var statusValue = req.query.statusValue
        var startDateValue = req.query.startDateValue ? new Date(req.query.startDateValue) : new Date(new Date().getFullYear(), 0, 1);
        var endDateValue = req.query.endDateValue ? new Date(req.query.endDateValue) : new Date();
        // var name = req.query.bName ? new RegExp(req.query.bName, 'i') : undefined; 
        var department = req.query.bDepartment ? new RegExp(req.query.bDepartment, 'i') : undefined;

        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

        var query = {};

        if (statusValue !== undefined) {
            if (statusValue === 'active') {
                query.isActive = true;
            } else if (statusValue === 'inactive') {
                query.isActive = false;
            }
        }

        if (startDateValue !== undefined && endDateValue !== undefined) {
            if (endDateValue < startDateValue) {
                res.status(400).json({
                    message: 'Invalid date range',
                    data: null
                })
                return;
            }
            query.createdAt = { $gt: startDateValue, $lt: endDateValue };
        }


        if (department !== undefined) {
            query['employeeDetails.department'] = { $regex: department }
        }

        query.employeeRole = { $in: ["seniorhr", "departmenthead", "employee"] }

        Employee
            .find(query)
            .then(function (item) {
                var paginatedData = item.slice(startIndex, endIndex);

                // console.log(item.length);
                // console.log(item)

                res.status(201).json({
                    message: 'Filtered employee data',
                    branchData: paginatedData,
                    totalCount: item.length
                })

            })
            .catch(function (err) {
                console.log(err);

                res.status(500).json({
                    message: 'Error filtering data',
                    data: err
                })
            })
    },

    generateCSVReport: async function (req, res) {
        var empId = req.params.id;
    
        try {
            var employeeData = await Employee.findById({ _id: empId });
    
            var data = [
                ['First Name', employeeData.firstName],
                ['Last Name', employeeData.lastName],
                ['Joining Date', employeeData.createdAt]
            ];
    
            console.log(data);
    
            var csvWriter = createCsvWriter({
                header: false,
                path: 'D:/employee_reports/employee_report.csv'
            });
    
            await csvWriter.writeRecords(data);
    
            // Delay for 500ms to ensure the file has been fully written
            await new Promise(resolve => setTimeout(resolve, 500));
    
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=employee_report.csv');
            res.sendFile('employee_report.csv', { root: __dirname });
    
        } catch (err) {
            console.error('Error writing CSV file:', err);
            res.status(500).send('Error exporting employee report');
        }
    }    

};

module.exports = employeeActivity;