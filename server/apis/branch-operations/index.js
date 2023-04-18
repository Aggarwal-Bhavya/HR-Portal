var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport.config')(passport);
var branchadminMiddleware = require('../../auth-middleware/auth').isBranchAdmin;
var companyadminMiddleware = require('../../auth-middleware/auth').isCompanyAdmin;

var branchOperations = require('../branch-operations/branch-activity.controller');
var branchAdminActions = require('../branch-operations/branchadmin-info.controller');

router.get('/all-branches/:id', passport.authenticate('jwt', {session: false}), companyadminMiddleware, branchOperations.getAllBranchInfo);

router.post('/create-branch', passport.authenticate('jwt', {session: false}), companyadminMiddleware, branchOperations.createBranch);

router.get('/branch/:id', passport.authenticate('jwt', {session: false}), branchOperations.getSpecificBranch);

router.put('/update-branch-info/:id', passport.authenticate('jwt', {session: false}), branchOperations.updateSpecificBranch);

router.get('/branch-head/:id/:branchId', passport.authenticate('jwt', {session: false}), branchOperations.getBranchHeadInfo);

router.get('/branch-departments/:id', passport.authenticate('jwt', {session: false}), branchOperations.getBranchDepartmentList);

router.get('/branch-admin-info/:id', passport.authenticate('jwt', {session: false}), branchAdminActions.getBranchAdminInfo);

router.put('/update-branchadmin', passport.authenticate('jwt', {session: false}), branchadminMiddleware, branchAdminActions.updateBranchAdmin);

router.put('/change-password', passport.authenticate('jwt', {session: false}), branchadminMiddleware, branchAdminActions.changePassword);

module.exports = router;