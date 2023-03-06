///<reference path="../app.js" />

app.controller('companyAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    'companyService',
    function ($scope, $http, $window, companyService) {
        $scope.branches = [];
        var currCompany = JSON.parse(localStorage.getItem('user'));
        // console.log(JSON.parse(localStorage.getItem('user')).companyDetails.companyId);
        // console.log(currCompany.companyDetails.companyId);


        // VIEWING ALL BRANCHES
        companyService
            .getAllBranches(currCompany.companyDetails.companyId)
            .then(function (res) {
                $scope.branches = res.data.branchData;
                console.log($scope.branches);
                // console.log(res.data.companyData)
            })
            .catch(function (err) {
                console.log(err);
            });


        // EDIT BRANCH INFO MODAL
        $scope.openEditModal = function (branch) {
            // console.log(branch._id);
            companyService
                .getBranch(branch._id)
                .then(function (res) {
                    $scope.branch = res.data.branchData;
                    // console.log($scope.company);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#editModal').modal('show');
        };

        $scope.saveData = function ($event) {
            $event.preventDefault();

            companyService
                .updateBranch($scope.branch)
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

            companyService
                .getCompanyAdmin(currCompany.companyDetails.companyId)
                .then(function (res) {
                    $scope.companyadmin = res.data.adminData;
                    $scope.companyadmin.password = ''
                    // console.log($scope.superadmin);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#updateCompanyAdminModal').modal('show');
        };

        $scope.updateCompanyAdmin = function ($event) {
            $event.preventDefault();
            $scope.companyadmin.id = currCompany.companyDetails.companyId;
            console.log($scope.companyadmin);
            companyService
                .putCompanyAdmin($scope.companyadmin)
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
            $scope.branch.id = currCompany.companyDetails.companyId;
            $scope.branch.companyName = currCompany.companyDetails.companyName;
            // console.log($scope.branch);

            companyService
                .createBranch($scope.branch)
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
            companyService
                .getCompany(currCompany.companyDetails.companyId)
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

            companyService
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
