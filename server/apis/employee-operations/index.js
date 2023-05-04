var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport.config')(passport);

var branchEmployees = require("./employee-info.controller");
var createEmployee = require("./employee-create.controller");

router.post('/new-employee', passport.authenticate('jwt', {session: false}), createEmployee.createEmployee);

router.put('/remove-employee/:id', passport.authenticate('jwt', {session: false}), createEmployee.removeEmployee);

router.get('/all-employees/:id', passport.authenticate('jwt', {session: false}), branchEmployees.getBranchEmployees);

router.get('/department-heads/:id', passport.authenticate('jwt', {session: false}), branchEmployees.getBranchDepartmentHeads);

router.get('/all-previous-employees/:id', passport.authenticate('jwt', {session: false}), branchEmployees.getPreviousBranchEmployees);

router.get('/employee-info/:id', passport.authenticate('jwt', {session: false}), branchEmployees.getSpecificEmployee);

router.put('/update-employee-info/:id', passport.authenticate('jwt', {session: false}), branchEmployees.updateSpecificEmployee);

router.get('/all-company-employees/:id', passport.authenticate('jwt', {session: false}), branchEmployees.getAllCompanyEmployees);

router.get('/filter-employees', passport.authenticate('jwt', {session: false}), branchEmployees.filterEmployees);

router.get('/filter-employees-roles', passport.authenticate('jwt', {session: false}), branchEmployees.filterEmployeeRoles);

router.put('/change-password', passport.authenticate('jwt', {session: false}), createEmployee.changePassword);

router.get('/employee-report/:id', branchEmployees.generateCSVReport);

module.exports = router;