///<reference path="../app.js" />

app.controller('companyAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    '$state',
    '$rootScope',
    '$element',
    'companyService',
    'companyFactory',
    function ($scope, $http, $window, $state, $rootScope, $element, companyService, companyFactory) {
        var currCompany = JSON.parse(localStorage.getItem('user'));

        $scope.viewName = currCompany.companyDetails.companyName;

        $scope.currentPage = 1;
        $scope.pageSize = 5;
        $scope.totalPages = 1;

        $scope.exists = true;

        // VIEWING ALL BRANCHES
        if ($state.current.name === 'sidepanel.viewall' || $state.current.name === 'sidepanel.dashboard') {
            $scope.branches = [];
            $scope.loading = true;
            getAllBranches();
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
                getAllBranches();
            };
        }

        function getAllBranches() {
            if ($scope.name || $scope.department || $scope.city) {
                companyService
                    .getFilteredBranches($scope.currentPage, $scope.pageSize, $scope.name, $scope.department, $scope.city)
                    .then(function (res) {
                        $scope.loading = false;
                        $scope.branches = res.data.branchData;
                        $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                    })
                    .catch(function (err) {
                        $scope.loading = true;
                        console.log(err);
                    })
            } else {
                companyFactory
                    .getBranches(currCompany.companyDetails.companyId, $scope.currentPage, $scope.pageSize, function (err, res) {
                        if (res) {
                            $scope.loading = false;
                            $scope.branches = res.data.branchData;
                            $rootScope.branchCount = res.data.totalCount;
                            $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                        } else {
                            $scope.loading = true;
                            console.log(err);
                        }
                    });
            }
        }

        // FILTER DATA
        $scope.filterData = function filterData() {
            if ($scope.name || $scope.department || $scope.city) {
                $scope.currentPage = 1;
                getAllBranches();
            }
        }

        // VIEWING ALL EMPLOYEES + PAGINATION
        if ($state.current.name === 'sidepanel.employees') {
            $scope.employees = [];
            $scope.loading = true;
            getActiveEmployeeData();
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
                getActiveEmployeeData();
            };
        }


        function getActiveEmployeeData() {
            if ($scope.bName || $scope.bDepartment || $scope.statusValue || $scope.startDateValue || $scope.endDateValue) {
                companyService
                    .getFilteredEmployees($scope.currentPage, $scope.pageSize, $scope.statusValue, $scope.startDateValue, $scope.endDateValue, $scope.bName, $scope.bDepartment)
                    .then(function (res) {
                        $scope.loading = false;
                        $scope.employees = res.data.companyData;
                        $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                    })
                    .catch(function (err) {
                        $scope.loading = true;
                        console.log(err);
                    })
            } else {
                companyFactory
                    .getAllEmployees(currCompany.companyDetails.companyId, $scope.currentPage, $scope.pageSize, function (err, res) {
                        if (res) {
                            $scope.loading = false;
                            $scope.employees = res.data.companyData;
                            $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                        } else {
                            $scope.loading = true;
                            console.log(err);
                        }
                    })
            }
        }

        $scope.filterEmployeeData = function filterEmployeeData() {
            console.log('filter employee')
            if ($scope.bName || $scope.bDepartment || $scope.statusValue || $scope.startDateValue || $scope.endDateValue) {
                $scope.currentPage = 1;
                getActiveEmployeeData();
            }
        }

        // GETTING COMPANY HEAD COUNT
        if (!$rootScope.headCount) {
            companyService
                .getCompanyHeadCount(currCompany.companyDetails.companyId)
                .then(function (res) {
                    $rootScope.headCount = res.data.headCount[0].count;
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        // GETTING EACH BRANCH PERFORMANCE
        // avg = branch.totalWorkingHours / branch.employeeCount
        if (!$rootScope.branchPerformance) {
            var today = new Date();
            // console.log(today.getFullYear());
            companyService
                .getBranchesPerformance(currCompany.companyDetails.companyId, today.getFullYear())
                .then(function (res) {
                    $rootScope.branchPerformance = res.data.branch;
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        // MORE DETAILS FOR SOME BRANCH
        $scope.moreDetails = function (branch) {
            // console.log(branch);
            $rootScope.specifcBranch = branch;
            $state.go("sidepanel.branch", { branch_id: branch._id });
        }

        // MORE DETAILS FOR SOME EMPLOYEE
        $scope.moreDetailsEmployee = function (employee) {
            $rootScope.specificEmployee = employee;
            $state.go("sidepanel.employee", { employee_id: employee._id });
            // console.log(employee)
        }


        // UPDATING COMPANY ADMIN INFORMATION MODAL
        $scope.openUpdateCompanyAdminModal = function () {
            companyFactory
                .getCompanyAdmin(currCompany.companyDetails.companyId, function (err, res) {
                    if (res) {
                        $scope.companyadmin = res.data.adminData;
                    } else {
                        console.log(err);
                    }
                });
            $http.get('#updateCompanyAdminModal').modal('show');
        };

        $scope.updateCompanyAdmin = function ($event) {
            $event.preventDefault();
            // $scope.companyadmin.id = currCompany.companyDetails.companyId;

            companyFactory
                .updateCompanyAdmin(currCompany.companyDetails.companyId, $scope.companyadmin, function (err, res) {
                    if (res) {
                        console.log(res.data);
                        alert(res.data.message);
                    } else {
                        console.log(err)
                        alert(err);
                    }
                })
        };


        // NEW BRANCH CREATION MODAL
        $scope.branch = {
            branchName: '',
            address: '',
            branchCity: '',
            contactNumber: [],
            departments: [],
            firstName: '',
            lastName: '',
            employeeEmail: '',
            personalEmail: '',
            gender: ''
        }

        $element.on('hidden.bs.modal', function () {
            $scope.$apply(function () {
                $scope.branch = {};
            });
        })

        $scope.openNewBranchModal = function () {
            $http.get('#newBranchModal').modal('show');
        };

        $scope.addNewBranch = function ($event) {
            $event.preventDefault();
            // $scope.branch.id = currCompany.companyDetails.companyId;
            companyFactory
                .addBranch(currCompany.companyDetails.companyId, currCompany.companyDetails.companyName, $scope.branch, function (err, res) {
                    if (res) {
                        alert(res.data.message);
                        $window.location.reload();
                    } else {
                        console.log(err)
                    }
                })
        };


        // EDIT COMPANY DETAILS
        $scope.openUpdateCompanyModal = function (company) {
            companyFactory
                .getCompany(currCompany.companyDetails.companyId, function (err, res) {
                    if (res) {
                        $scope.company = res.data.companyData;
                    } else {
                        console.log(err);
                    }
                })
            $http.get('#updateCompanyModal').modal('show');
        };

        $scope.updateCompany = function ($event) {
            $event.preventDefault();
            companyFactory
                .updateCompany($scope.company, function (err, res) {
                    if (res) {
                        $window.location.reload();
                    } else {
                        console.log(err);
                    }
                })
        };

        // CHANGE PASSWORD MODAL
        $scope.openSetPasswordModal = function () {
            $http.get('#setPasswordModal').modal('show');
        };

        $scope.changePassword = function ($event) {
            $event.preventDefault();

            var newDetails = {
                id: currCompany.userId,
                password: $scope.newPassword
            }
            companyService
                .changePassword(newDetails)
                // companyFactory
                //     .changePassword(currCompany.companyDetails.companyId, $scope.newPassword)
                .then(function (res) {
                    console.log(res.data.data);
                    // alert(res.data.message);
                    // $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err);
                })
        };

        $scope.newPassword = '';
        $scope.confirmPassword = '';

        $element.on('hidden.bs.modal', function () {
            $scope.$apply(function () {
                $scope.newPassword = '';
                $scope.confirmPassword = '';
            });
        });

        $scope.errorMessages = {
            required: 'This field is required.',
            pattern: 'Invalid format.',
        };

        $scope.logoutAction = function () {
            localStorage.removeItem("Authorization");
            localStorage.removeItem("user");
            $state.go("login");
        };
    }
]);