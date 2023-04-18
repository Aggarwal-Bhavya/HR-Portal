///<reference path="../app.js" />

app.factory('companyFactory', [
    'companyService',
    '$q',
    function (companyService, $q) {
        var factory = {};

        factory.getBranches = function (companyId, currPage, pageSize, cb) {
            companyService
                .getAllBranches(companyId, currPage, pageSize)
                .then(function (res) {
                    cb(null, res);
                })
                .catch(function (err) {
                    cb(err, null);
                });
        };

        factory.getAllEmployees = function (companyId, currPage, pageSize, cb) {
            companyService
                .getAllCompanyEmployees(companyId, currPage, pageSize)
                .then(function (res) {
                    cb(null, res);
                })
                .catch(function (err) {
                    cb(err, null);
                });
        };

        factory.getCompanyAdmin = function (companyId, cb) {
            companyService
                .getCompanyAdmin(companyId)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                });
        };

        factory.updateCompanyAdmin = function (companyId, userData, cb) {
            userData.id = companyId;

            companyService
                .putCompanyAdmin(userData)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                });
        };

        factory.addBranch = function (companyId, companyName, branchData, cb) {
            branchData.id = companyId;
            branchData.companyName = companyName;

            companyService
                .createBranch(branchData)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                });
        };

        factory.updateCompany = function (companyData, cb) {
            companyService
                .updateCompany(companyData)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                });
        };

        factory.changePassword = function (id, password) {
            var newDetails = {
                id: id,
                password: password
            };

            console.log(newDetails);
            return companyService.changePassword(newDetails);
        };

        factory.getCompany = function (companyId, cb) {
            companyService
                .getCompany(companyId)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                })
        };

        factory.getBranch = function (branchId, cb) {
            companyService
                .getBranch(branchId)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                })
        };

        factory.updateBranch = function (branchData, cb) {
            companyService
                .updateBranch(branchData)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                })
        };

        factory.getBranchHead = function (companyId, branchId, cb) {
            companyService
                .getBranchHead(companyId, branchId)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                })
        };

        return factory;
    }
])