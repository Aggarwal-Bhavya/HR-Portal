var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport.config')(passport);
var superadminMiddleware = require('../../auth-middleware/auth').isSuperAdmin;
var companyadminMiddleware = require('../../auth-middleware/auth').isCompanyAdmin;

var companyOperations = require('./company-activity.controller');
var companyAdminActions = require('./companyadmin-info.controller');
var companyStats = require('./company-stats.controller');

router.post('/create-company', passport.authenticate('jwt', {session: false}), superadminMiddleware, companyOperations.createCompany);

router.get('/all-companies', passport.authenticate('jwt', {session: false}), superadminMiddleware, companyOperations.getAllActiveCompanies);

router.get('/inactive-companies', companyOperations.getAllInactiveCompanies);

router.get('/company/:id', passport.authenticate('jwt', {session: false}), companyOperations.getSpecificCompany);

router.put('/update-company-info/:id', passport.authenticate('jwt', {session: false}), companyOperations.updateSpecificCompany);

router.put('/deactivate-company/:id', passport.authenticate('jwt', {session: false}), companyOperations.deactivateCompany);

router.put('/activate-company/:id', passport.authenticate('jwt', {session: false}), companyOperations.activateCompany);

router.get('/filter-data', passport.authenticate('jwt', {session: false}), companyOperations.filterCompanyData);

router.get('/company-admin-info/:id', passport.authenticate('jwt', {session: false}), companyadminMiddleware, companyAdminActions.getCompanyAdminInfo);

router.put('/update-companyadmin', passport.authenticate('jwt', {session: false}), companyadminMiddleware, companyAdminActions.updateCompanyAdminInfo);

router.put('/change-password', companyAdminActions.changePassword);

router.get('/company-head-count/:id', companyStats.companyHeadCount);

router.get('/branch-performance/:id/:year', companyStats.branchPerformance);

router.get('/monthly-performance/:id/:month/:year', companyStats.performanceAnalysis);

router.get('/monthly-ratios/:compId/:branchId/:month/:year', companyStats.monthlyRatios);


module.exports = router;