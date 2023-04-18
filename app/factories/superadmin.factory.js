///<reference path="../app.js" />

app.factory('superadminFactory', [
    'superadminService',
    'validateFactory',
    function (superadminService, validateFactory) {
        var factory = {};

        factory.getCompanies = function (currPage, pageSize, cb) {
            superadminService
                .getAllCompanies(currPage, pageSize)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                })
        };

        factory.getAdmin = function (cb) {
            superadminService
                .getSuperadmin()
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                })
        };

        factory.updateAdmin = function (userData, cb) {
            // return superadminService.updateSuperadmin(userData);
            if (!validateFactory.validateName(userData.firstName)) {
                return cb('Invalid Name', null);
            }

            if (!validateFactory.validateName(userData.lastName)) {
                return cb('Invalid Name', null);
            }

            superadminService
                .updateSuperadmin(userData)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                })
        };

        factory.createCompany = function (companyData, cb) {
            // return superadminService.createCompany(companyData);
            superadminService
                .createCompany(companyData)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                });
        };

        factory.getCompany = function (companyId, cb) {
            superadminService
                .getCompany(companyId)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                })
        };

        factory.updateCompany = function (companyData, cb) {
            superadminService
                .updateCompany(companyData)
                .then(function (res) {
                    cb(null, res);
                })
                .catch(function (err) {
                    cb(err, null);
                });
        };

        factory.removeCompany = function (companyId, cb) {
            superadminService
                .deactivateCompany(companyId)
                .then(function (res) {
                    cb(null, res)
                })
                .catch(function (err) {
                    cb(err, null)
                });
        };

        factory.changePassword = function (password) {
            return superadminService.changePassword({ password: password });
        };

        return factory;
    }
])