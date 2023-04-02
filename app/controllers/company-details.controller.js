///<reference path="../app.js" />

app.controller('companyDetailsCtrl', [
    '$scope',
    '$rootScope',
    '$stateParams',
    '$window',
    '$http',
    'superadminService',
    function ($scope, $rootScope, $stateParams, $window, $http, superadminService) {
        var companyId = $stateParams.company_id;
        superadminService
            .getCompany(companyId)
            .then(function (res) {
                $rootScope.specificCompany = res.data.companyData;
                $scope.companyData = $rootScope.specificCompany;
            })
            .catch(function (err) {
                console.log(err);
            });


        // EDIT COMPANY INFO MODAL
        $scope.openEditModal = function (company) {
            console.log(company)
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
    }
]
);