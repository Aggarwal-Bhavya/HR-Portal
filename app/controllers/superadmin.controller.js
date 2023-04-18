///<reference path="../app.js" />

app.controller('superAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    '$state',
    '$stateParams',
    '$element',
    'superadminService',
    'superadminFactory',
    '$rootScope',
    function ($scope, $http, $window, $state, $stateParams, $element, superadminService, superadminFactory, $rootScope) {
        $scope.currentPage = 1;
        $scope.pageSize = 5;
        $scope.totalPages = 1;

        // VIEWING ALL CLIENTS + PAGINATION
        if ($state.current.name === 'sidebar.dashboard' || $state.current.name === 'sidebar.viewall') {
            $scope.loading = true;
            $scope.companies = [];
            getAllCompanies();
            $scope.loadPage = function (page) {
                if (page === '...') {
                    return;
                }
                if (page < 1) {
                    page = 1
                } else if (page > $scope.totalPages) {
                    page = $scope.totalPages;
                }
                $scope.currentPage = page;
                getAllCompanies();
            };
        }

        function getAllCompanies() {
            superadminFactory
                .getCompanies($scope.currentPage, $scope.pageSize, function (err, res) {
                    if (res) {
                        $scope.loading = false;
                        $scope.companies = res.data.companyData;
                        $scope.activeCount = res.data.companyData.length;
                        $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                    } else {
                        $scope.loading = true;
                        console.log('Errorrr    ', err);
                    }
                })
        }


        // VIEWING ALL INACTIVE CLIENTS + PAGINATION
        if ($state.current.name === 'sidebar.previous-customers') {
            $scope.loading = true;
            $scope.companies = [];
            getAllInactiveCompanies();
            $scope.loadPage = function (page) {
                if (page === '...') {
                    return;
                }
                if (page < 1) {
                    page = 1
                } else if (page > $scope.totalPages) {
                    page = $scope.totalPages;
                }
                $scope.currentPage = page;
                getAllInactiveCompanies();
            };
        }

        function getAllInactiveCompanies() {
            superadminService
                .getAllInactiveCompanies($scope.currentPage, $scope.pageSize)
                .then(function (res) {
                    $scope.loading = false;
                    // $scope.inactiveCompanies = res.data.companyData;
                    $scope.inactiveCompanies = res.data.companyData;
                    $rootScope.inactiveCount = res.data.companyData.length;
                    $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                })
                .catch(function (err) {
                    $scope.loading = true;
                    console.log(err);
                })
        }


        // MORE DETAILS FOR SOME COMPANY + REDIRECTION TO STATE
        $scope.moreDetails = function (company) {
            superadminFactory
                .getCompany(company._id, function (err, res) {
                    if (res) {
                        $rootScope.specificCompany = res.data.companyData;
                        $state.go("sidebar.company", { company_id: company._id });
                    } else {
                        console.log(err)
                    }
                });
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

            superadminFactory
                .getAdmin(function (err, res) {
                    if (res) {
                        $scope.superadmin = res.data.adminData;
                        $scope.doj = res.data.adminData.createdAt;
                    } else {
                        console.log(err);
                    }
                });
            $http.get('#updateSuperAdminModal').modal('show');
        };

        $scope.updateSuperAdmin = function ($event) {
            $event.preventDefault();
            superadminFactory
                .updateAdmin($scope.superadmin, function (err, res) {
                    if(res) {
                        alert('success');
                    } else {
                        console.log(err);
                    }
                });
        };


        // NEW COMPANY CREATION MODAL
        $scope.company = {
            companyName: '',
            companyLogo: '',
            email: '',
            phoneNumber: '',
            companyWebsite: '',
            firstName: '',
            lastName: '',
            employeeEmail: '',
            personalEmail: '',
            gender: ''
        };

        $element.on('hidden.bs.modal', function () {
            $scope.$apply(function () {
                $scope.company = {};
            });
        })

        $scope.openNewCompanyModal = function () {
            $http.get('#newCompanyModal').modal('show');
        };

        $scope.addNewCompany = function ($event) {
            $event.preventDefault();
            // console.log($scope.company);

            superadminFactory
                .createCompany($scope.company, function (err, res) {
                    if(res) {
                        alert(res.data.message);
                        $window.location.reload();
                    } else {
                        console.log(err);
                    }
                });
        };

        // CHANGE PASSWORD MODAL
        $scope.openSetPasswordModal = function () {
            $http.get('#setPasswordModal').modal('show');
        };

        $scope.changePassword = function ($event) {
            $event.preventDefault();

            superadminFactory
                .changePassword($scope.newPassword)
                .then(function (res) {
                    // console.log(res.data);
                    alert(res.data.message);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err);
                })
        };

        $scope.logoutAction = function () {
            localStorage.removeItem("Authorization");
            localStorage.removeItem("user");
            $state.go("login");
        };

        $scope.errorMessages = {
            required: 'This field is required.',
            pattern: 'Invalid format.',
        };

    }
]);