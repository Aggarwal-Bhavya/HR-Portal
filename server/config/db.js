var mongoose = require('mongoose');
mongoose.set('strictQuery', true);
var Employee = require('../models/employee');

var superAdminDetails = {
    firstName: "SuperAdmin",
    employeeEmail: "superadmin@yahoo.com",
    personalEmail: "superadmin@gmail.com",
    password: "SuperAdmin@123",
    department: "Owner",
    dateOfBirth: "01/01/01",
    bloodGroup: "rda",
    gender: "rda",
    aadharNumber: "100000000000",
    maritalStatus: "rda",
    currentAddress: "rda",
    permanentAddress: "rda",
    employeeRole: "superadmin",
};

var connection = mongoose.connect('mongodb://localhost:27017/hr-portal')
.then(function() {
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
.catch(function(err) {
    console.log(err);
});

module.exports = connection;