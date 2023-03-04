///<reference path="../app.js" />

app.controller('companyAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    'superadminService',
    function ($scope, $http, $window, superadminService) {
        $scope.companies = [];

        // VIEWING ALL CLIENTS
        superadminService
            .getAllCompanies()
            .then(function (res) {
                $scope.companies = res.data.companyData;
                // console.log($scope.companies);
                // console.log(res.data.companyData)
            })
            .catch(function (err) {
                console.log(err);
            });


        // EDIT BRANCH INFO MODAL
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

        // UPDATING COMPANY ADMIN INFORMATION MODAL
        $scope.openUpdateCompanyAdminModal = function () {

            superadminService
                .getSuperadmin()
                .then(function (res) {
                    $scope.superadmin = res.data.adminData;
                    // console.log($scope.superadmin);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#updateCompanyAdminModal').modal('show');
        };

        $scope.updateCompanyAdmin = function ($event) {
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


        // NEW BRANCH CREATION MODAL
        $scope.openNewBranchModal = function () {
            $http.get('#newBranchModal').modal('show');
        };

        $scope.addNewBranch = function ($event) {
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


        // EDIT COMPANY DETAILS
        $scope.openUpdateCompanyModal = function (company) {
            superadminService
                .getCompany(company._id)
                .then(function (res) {
                    $scope.company = res.data.companyData;
                    // console.log($scope.company);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#updateCompanyModal').modal('show');
        };

        $scope.updateCompany = function ($event) {
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
    }
])
