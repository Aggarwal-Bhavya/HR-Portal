///<reference path="../app.js" />

app.controller('superAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    '$state',
    '$stateParams',
    'superadminService',
    '$rootScope',
    function ($scope, $http, $window, $state, $stateParams, superadminService, $rootScope) {

        // VIEWING ALL CLIENTS
        if (!$rootScope.companies) {
            superadminService
                .getAllCompanies()
                .then(function (res) {
                    // $scope.companies = res.data.companyData;
                    $rootScope.companies = res.data.companyData;
                    $scope.activeCount = res.data.companyData.length;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        // VIEWING ALL INACTIVE CLIENTS
        if (!$rootScope.inactiveCompanies) {
            superadminService
                .getAllInactiveCompanies()
                .then(function (res) {
                    // $scope.inactiveCompanies = res.data.companyData;
                    $rootScope.inactiveCompanies = res.data.companyData;
                    $scope.inactiveCount = res.data.companyData.length;
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        // MORE DETAILS FOR SOME COMPANY
        $scope.moreDetails = function (company) {
            superadminService
                .getCompany(company._id)
                .then(function (res) {
                    // console.log(res.data.companyData);
                    $rootScope.specificCompany = res.data.companyData;
                    $state.go("sidebar.company", { company_id: company._id });
            
                })
                .catch(function (err) {
                    console.log(err);
                })
            }


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
                    $scope.doj = res.data.adminData.createdAt;
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
