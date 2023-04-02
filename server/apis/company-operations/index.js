var express = require('express');
var router = express.Router();

var companyOperations = require('./company-activity.controller');
var companyAdminActions = require('./companyadmin-info.controller');
var companyStats = require('./company-stats.controller');

router.post('/create-company', companyOperations.createCompany);
router.get('/all-companies', companyOperations.getAllActiveCompanies);
router.get('/inactive-companies', companyOperations.getAllInactiveCompanies);
router.get('/company/:id', companyOperations.getSpecificCompany);
router.put('/update-company-info/:id', companyOperations.updateSpecificCompany);
router.put('/deactivate-company/:id', companyOperations.deactivateCompany);
router.put('/activate-company/:id', companyOperations.activateCompany);
router.get('/company-admin-info/:id', companyAdminActions.getCompanyAdminInfo);
router.put('/update-companyadmin', companyAdminActions.updateCompanyAdminInfo);
router.get('/company-head-count/:id', companyStats.companyHeadCount);
router.get('/branch-performance/:id/:year', companyStats.branchPerformance);
router.get('/monthly-performance/:id/:month/:year', companyStats.performanceAnalysis);
router.get('/monthly-ratios/:compId/:branchId/:month/:year', companyStats.monthlyRatios)

module.exports = router;