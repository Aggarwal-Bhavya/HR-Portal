var express = require('express');
var router = express.Router();

var branchEmployees = require("./employee-info.controller");
var createEmployee = require("./employee-create.controller");

router.post('/new-employee', createEmployee.createEmployee);
router.put('/remove-employee/:id', createEmployee.removeEmployee);
router.get('/all-employees/:id', branchEmployees.getBranchEmployees);
router.get('/department-heads/:id', branchEmployees.getBranchDepartmentHeads);
router.get('/all-previous-employees/:id', branchEmployees.getPreviousBranchEmployees);
router.get('/employee-info/:id', branchEmployees.getSpecificEmployee);
router.put('/update-employee-info/:id', branchEmployees.updateSpecificEmployee);
router.get('/all-company-employees/:id', branchEmployees.getAllCompanyEmployees);
router.put('/change-password', createEmployee.changePassword);

module.exports = router;