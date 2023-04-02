var express = require('express');
var router = express.Router();

var branchOperations = require('../branch-operations/branch-activity.controller');
var branchAdminActions = require('../branch-operations/branchadmin-info.controller');

router.get('/all-branches/:id', branchOperations.getAllBranchInfo);
router.post('/create-branch', branchOperations.createBranch);
router.get('/branch/:id', branchOperations.getSpecificBranch);
router.put('/update-branch-info/:id', branchOperations.updateSpecificBranch);
router.get('/branch-head/:id/:branchId', branchOperations.getBranchHeadInfo);
router.get('/branch-departments/:id', branchOperations.getBranchDepartmentList);
router.get('/branch-admin-info/:id', branchAdminActions.getBranchAdminInfo);
router.put('/update-branchadmin', branchAdminActions.updateBranchAdmin);

module.exports = router;