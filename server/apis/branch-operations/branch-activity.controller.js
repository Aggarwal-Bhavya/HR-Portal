var Branch = require("../branch-operations/branch.model");
var Employee = require("../../models/employee");

var branchActivity = {
    getAllBranchInfo: function (req, res) {
        var id = req.params.id;
        var page = parseInt(req.query.page);
        var count = parseInt(req.query.count);

        var startIndex = (page - 1) * count;
        var endIndex = page * count;

        Branch
            .find({
                "company.companyId": id
            })
            .then(function (item) {
                // console.log(item)
                var paginatedData = item.slice(startIndex, endIndex);
                res.status(201).json({
                    message: 'All brances are: ',
                    branchData: paginatedData,
                    totalCount: item.length
                })
            })
            .catch(function (err) {
                console.log("Error in fetching branch info   ", err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    },

    createBranch: function (req, res) {
        // console.log(req.body);
        var id = req.body.id;
        var companyName = req.body.companyName;
        var newBranch = new Branch({
            branchName: req.body.branchName,
            departments: req.body.departments,
            address: req.body.address,
            city: req.body.city,
            contactNumber: req.body.contactNumber,
            company: {
                companyId: id,
                companyName: companyName
            }
        });

        newBranch
            .save()
            .then(function (data) {
                var branchAdmin = new Employee({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    employeeEmail: req.body.employeeEmail,
                    personalEmail: req.body.personalEmail,
                    password: req.body.password,
                    department: "rda",
                    bloodGroup: "rda",
                    gender: "rda",
                    maritalStatus: "rda",
                    currentAddress: "rda",
                    permanentAddress: "rda",
                    employeeRole: "branchadmin",
                    aadharNumber: req.body.aadharNumber,
                    company: {
                        companyId: data.company.companyId,
                        companyName: data.company.companyName
                    },
                    branch: {
                        branchId: data._id,
                        branchName: data.branchName,
                        branchCity: data.city
                    }
                });

                branchAdmin
                    .save()
                    .then(function (item) {
                        res.status(201).json({
                            message: 'Branch and admin created successfully',
                            data: req.body,
                            branch: data,
                            admin: item
                        })
                    })
                    .catch(function (err) {
                        console.log("branch admin error    ", err);
                        res.status(500).json({
                            message: err
                        })
                    })
            })
            .catch(function (err) {
                console.log("branch creation error    ", err);
                res.status(500).json({
                    message: err
                })
            })
    },

    getSpecificBranch: function (req, res) {
        var id = req.params.id;

        Branch
            .findById({
                _id: id
            })
            .then(function (item) {
                res.status(201).json({
                    message: 'Branch data found',
                    branchData: item
                })
            })
            .catch(function (err) {
                console.log('get specific branch error    ', err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    },

    updateSpecificBranch: function (req, res) {
        var id = req.params.id;

        var updateBranch = {
            branchName: req.body.branchName,
            departments: req.body.departments,
            address: req.body.address,
            city: req.body.city,
            contactNumber: req.body.contactNumber
        }

        Branch
            .findByIdAndUpdate(
                { _id: id },
                { $set: updateBranch },
                { new: true }
            )
            .then(function (item) {
                res.status(201).json({
                    message: 'Branch info updated',
                    branchData: item
                })
            })
            .catch(function (err) {
                console.log("Branch info update error    ", err);
                res.status(500).json({
                    message: 'Branch update error',
                    data: err
                })
            })
    },

    getBranchHeadInfo: function (req, res) {
        var id = req.params.id;
        var branchId = req.params.branchId;

        Employee
            .findOne({
                $and: [
                    { isActive: true },
                    { employeeRole: "branchadmin" },
                    { "company.companyId": id },
                    { "branch.branchId": branchId }
                ]
            },
                {
                    firstName: 1,
                    lastName: 1,
                    designation: 1,
                    employeeEmail: 1,
                    personalEmail: 1,
                    gender: 1,
                    createdAt: 1
                })
            .then(function (item) {
                // console.log(item);
                res.status(201).json({
                    message: 'Branch Head Information',
                    branchHead: item
                })
            })
            .catch(function (err) {
                console.log('Brand admin info fetch error     ', err);
                res.status(500).json({
                    message: 'Error',
                    data: err
                })
            })
    },

    getBranchDepartmentList: function (req, res) {
        var id = req.params.id;

        Branch
            .findOne(
                { _id: id },
                {
                    departments: 1,
                    _id: 0,
                    branchName: 1
                }
            )
            .then(function (item) {
                // console.log(item);
                res.status(201).json({
                    message: 'Found branch department data',
                    departments: item
                })
            })
            .catch(function (err) {
                console.log("Error fetching branch department data   ", err);
                res.status(500).json({
                    message: 'Branch Departments not found',
                    data: err
                })
            })
    }
};

module.exports = branchActivity;