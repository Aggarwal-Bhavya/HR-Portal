///<reference path="../app.js" />

app.controller('superAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    'superadminService',
    '$location',
    function ($scope, $http, $window, superadminService, $location) {
        $scope.companies = [];

        // VIEWING ALL CLIENTS
        superadminService
        .getAllCompanies()
        .then(function (res) {
            $scope.companies = res.data.companyData;
            // console.log($scope.companies);
            // console.log(res.data.companyData)
        })
        .catch(function(err) {
            console.log(err);
        });


        // EDIT COMPANY INFO MODAL
        $scope.openEditModal = function (company) {
                superadminService
                .getCompany(company._id)
                .then(function (res) {
                    $scope.company = res.data.companyData;
                    // console.log($scope.company);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#editModal').modal('show');
        };

        $scope.saveData = function ($event) {
            $event.preventDefault();

            superadminService
            .updateCompany($scope.company)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err);
                })
        };


        // DEACTIVATING COMPANY ACCOUNT MODAL
        $scope.openDeleteModal = function (company) {
            superadminService
            .getCompany(company._id)
                .then(function (res) {
                    $scope.company = res.data.companyData;
                    // console.log($scope.company);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#deleteModal').modal('show');
        };

        $scope.deleteData = function ($event) {
            $event.preventDefault();
            
            superadminService
            .deactivateCompany($scope.company._id)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };


        // ACTIVATING A COMPANY ACCOUNT MODAL
        $scope.openActivateModal = function (company) {
            superadminService
            .getCompany(company._id)
                .then(function (res) {
                    $scope.company = res.data.companyData;
                    // console.log($scope.company);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#activateModal').modal('show');
        };

        $scope.activateData = function ($event) {
            $event.preventDefault();
           
            superadminService
            .activateCompany($scope.company._id)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };


        // UPDATING SUPER ADMIN INFORMATION MODAL
        $scope.openUpdateSuperAdminModal = function () {
            
            superadminService
            .getSuperadmin()
                .then(function (res) {
                    $scope.superadmin = res.data.adminData;
                    $scope.superadmin.password = '';
                    // console.log($scope.superadmin);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#updateSuperAdminModal').modal('show');
        };

        $scope.updateSuperAdmin = function ($event) {
            $event.preventDefault();
            
            superadminService
            .updateSuperadmin($scope.superadmin)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };


        // NEW COMPANY CREATION MODAL
        $scope.openNewCompanyModal = function () {
            $http.get('#newCompanyModal').modal('show');
        };

        $scope.addNewCompany = function ($event) {
            $event.preventDefault();
            // console.log($scope.company);
            
            superadminService
            .createCompany($scope.company)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };
    }
])
