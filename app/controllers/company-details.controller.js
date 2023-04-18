///<reference path="../app.js" />

app.controller('companyDetailsCtrl', [
    '$scope',
    '$rootScope',
    '$stateParams',
    '$window',
    '$http',
    'superadminService',
    'superadminFactory',
    function ($scope, $rootScope, $stateParams, $window, $http, superadminService, superadminFactory) {
        var companyId = $stateParams.company_id;
        superadminFactory
            .getCompany(companyId, function (err, res) {
                if (res) {
                    $rootScope.specificCompany = res.data.companyData;
                    $scope.companyData = $rootScope.specificCompany;
                } else {
                    console.log(err);
                }
            });


        // EDIT COMPANY INFO MODAL
        $scope.openEditModal = function (company) {
            // console.log(company)
            superadminFactory
                .getCompany(companyId, function (err, res) {
                    if (res) {
                        $scope.company = res.data.companyData;
                    } else {
                        console.log(err);
                    }
                })
            $http.get('#editModal').modal('show');
        };

        $scope.saveData = function ($event) {
            $event.preventDefault();

            superadminFactory
                .updateCompany($scope.company, function (err, res) {
                    if (res) {
                        $window.location.reload();
                    } else {
                        console.log(err);
                    }
                })
        };


        // DEACTIVATING COMPANY ACCOUNT MODAL
        $scope.openDeleteModal = function (company) {
            superadminFactory
                .getCompany(company._id, function (err, res) {
                    if (res) {
                        $scope.company = res.data.companyData;
                    } else {
                        console.log(err);
                    }
                })
            $http.get('#deleteModal').modal('show');
        };

        $scope.deleteData = function ($event) {
            $event.preventDefault();

            superadminFactory
                .removeCompany($scope.company._id, function (err, res) {
                    if(res) {
                        $window.location.reload();
                    } else {
                        console.log(err)
                    }
                });
        };
    }
]
);