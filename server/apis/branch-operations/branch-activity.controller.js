var Branch = require("../branch-operations/branch.model");
var Employee = require("../employee-operations/employee.model")
var crypto = require("crypto");
var bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");

function hashPassword(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return { salt, hash };
}

function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

function sendMail(employeeEmail, password) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'aggarwal.bhavya57@gmail.com',
            pass: 'ojgqmtrditwvbvor',
        },
    });

    var mailOptions = {
        from: 'aggarwal.bhavya57@gmail.com',
        to: employeeEmail,
        subject: 'Account Created',
        html: `<p><strong>Congratulations!</strong></p><br>You are the branch admin. The password for your account is <strong>${password}<strong>. <br>Please log in and change it.`
    }

    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            console.log('Error sending mail', err)
        } else {
            console.log('Email sent successfully!')
        }
    })
}

// function generateEmployeeId() {
//     const length = 7;
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';

//     for (let i = 0; i < length; i++) {
//         result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }

//     return result;
// }

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
            // departments: req.body.departments,
            address: req.body.address,
            city: req.body.branchCity,
            // contactNumber: req.body.contactNumber,
            company: {
                companyId: id,
                companyName: companyName
            }
        });

        if (req.body.departments) {
            var departmentArr = req.body.departments.split(',');
            departmentArr.forEach(function (dept) {
                newBranch.departments.push(dept.trim());
            })
        }

        if (req.body.contactNumber) {
            var contactArr = req.body.contactNumber.split(',');
            contactArr.forEach(function (num) {
                newBranch.contactNumber.push(num.trim());
            })
        }

        newBranch
            .save()
            .then(function (data) {
                var password = generateRandomString(10);
                var { salt, hash } = hashPassword(password);
                var branchAdmin = new Employee({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: password,
                    passwordHash: hash,
                    passwordSalt: salt,
                    personalDetails: {
                        contact: {
                            personalEmail: req.body.personalEmail,
                            phoneNumber: req.body.phoneNumber
                        },
                        gender: req.body.gender,
                    },
                    employeeDetails: {
                        employeeEmail: req.body.employeeEmail,
                        designation: "Branch Admin",
                    },
                    employeeRole: "branchadmin",
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
                        sendMail(item.employeeDetails.employeeEmail, password);
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
        // console.log(req.body);

        var updateBranch = {
            branchName: req.body.branchName,
            address: req.body.address,
            city: req.body.city,
            departments: [],
            contactNumber: []
        }

        if (req.body.departments) {

            req.body.departments.forEach(function (dept) {
                updateBranch.departments.push(dept.trim());
            })

        }

        if (req.body.contactNumber) {

            req.body.contactNumber.forEach(function (num) {
                updateBranch.contactNumber.push(num.trim());
            })

        }
        console.log(updateBranch)

        Branch
            .updateOne(
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
                    'employeeDetails.designation': 1,
                    'employeeDetails.employeeEmail': 1,
                    // personalDetails.personalEmail: 1,
                    personalDetails: 1,
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