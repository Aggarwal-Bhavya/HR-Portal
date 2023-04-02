///<reference path="../app.js" />

app.controller('companyAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    '$state',
    '$rootScope',
    'companyService',
    function ($scope, $http, $window, $state, $rootScope, companyService) {
        var currCompany = JSON.parse(localStorage.getItem('user'));

        $scope.viewName = currCompany.companyDetails.companyName;

        $scope.currentPage = 1;
        $scope.pageSize = 5;
        $scope.totalPages = 1;

        // VIEWING ALL BRANCHES
        if($state.current.name === 'sidepanel.viewall' || $state.current.name === 'sidepanel.dashboard') {
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
            companyService
                .getAllBranches(currCompany.companyDetails.companyId, $scope.currentPage, $scope.pageSize)
                .then(function (res) {
                    $scope.loading = false;
                    $scope.branches = res.data.branchData;
                    $rootScope.branchCount = res.data.totalCount;
                    $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);

                })
                .catch(function (err) {
                    console.log(err);
                });
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
            companyService
                .getAllCompanyEmployees(currCompany.companyDetails.companyId, $scope.currentPage, $scope.pageSize)
                .then(function (res) {
                    $scope.loading = false;
                    $scope.employees = res.data.companyData;
                    $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                    console.log($scope.employees);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        // GETTING COMPANY HEAD COUNT
        if(!$rootScope.headCount) {
            companyService
                .getCompanyHeadCount(currCompany.companyDetails.companyId)
                .then(function(res) {
                    $rootScope.headCount = res.data.headCount[0].count;
                    // console.log($rootScope.headCount);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        // GETTING EACH BRANCH PERFORMANCE
        // avg = branch.totalWorkingHours / branch.employeeCount
        if(!$rootScope.branchPerformance) {
            var today = new Date();
            // console.log(today.getFullYear());
            companyService
                .getBranchesPerformance(currCompany.companyDetails.companyId, today.getFullYear())
                .then(function (res) {
                    $rootScope.branchPerformance = res.data.branch;
                    // console.log($rootScope.branchPerformance);
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
        // MORE DETAILS FOR SOME EMPLOYEE
        $scope.moreDetailsEmployee = function (employee) {
            $rootScope.specificEmployee = employee;
            $state.go("sidepanel.employee", { employee_id: employee._id });
            // console.log(employee)
        }


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
