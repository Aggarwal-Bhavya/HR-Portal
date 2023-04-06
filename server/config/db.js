var mongoose = require('mongoose');
mongoose.set('strictQuery', true);
var Employee = require('../apis/employee-operations/employee.model');
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


var password = generateRandomString(10);
var { salt, hash } = hashPassword(password);
var superAdminDetails = {
    firstName: "SuperAdmin",
    'employeeDetails.employeeEmail': "superadmin@gmail.com",
    'personalDetails.contact.personalEmail': "superadmin@yahoo.com",
    'personalDetails.gender': "other",
    password: password,
    passwordHash: hash,
    passwordSalt: salt,
    department: "Owner",
    employeeRole: "superadmin",
};

var connection = mongoose.connect('mongodb://localhost:27017/hr-portal')
    .then(function () {
        // var once = true;
        // while(once) {
        //     var superAdmin = new Employee(superAdminDetails);
        //     superAdmin
        //     .save()
        //     .then(function(){
        //         console.log('Successfully added super admin!');
        //     })
        //     .catch(function(err) {
        //         console.log(err);
        //     });
        //     once = false;
        // }
        console.log('DB connection success!');
    })
    .catch(function (err) {
        console.log(err);
    });

module.exports = connection;