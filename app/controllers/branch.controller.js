///<reference path="../app.js" />

app.controller('branchAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    '$rootScope',
    '$state',
    '$q',
    '$element',
    'branchService',
    'companyService',
    function ($scope, $http, $window, $rootScope, $state, $q, $element, branchService, companyService) {
        $scope.genders = ["male", "female", "other"];
        $scope.employeeRoles = ["departmenthead", "hradmin", "employee"];

        var currBranch = JSON.parse(localStorage.getItem('user'));
        $scope.branch = currBranch.branchDetails;

        $scope.currentPage = 1;
        $scope.pageSize = 5;
        $scope.totalPages = 1;

        // VIEWING ALL EMPLOYEES + PAGINATION
        if ($state.current.name === 'sideboard.viewall' || $state.current.name === 'sideboard.dashboard') {
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
            branchService
                .getAllEmployees(currBranch.branchDetails.branchId, $scope.currentPage, $scope.pageSize)
                .then(function (res) {
                    $scope.loading = false;
                    $scope.employees = res.data.branchData;
                    $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                    $scope.headCount = res.data.totalCount;
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        // VIEWING DEPARTMENT HEADS INFO + PAGINATION
        if ($state.current.name === 'sideboard.viewall-deptheads') {
            $scope.departmentHeads = [];
            $scope.loading = true;
            getDepartmentHeadsData();
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
                getDepartmentHeadsData();
            };
        }

        function getDepartmentHeadsData() {
            branchService
                .getAllDepartmentHeads(currBranch.branchDetails.branchId, $scope.currentPage, $scope.pageSize)
                .then(function (res) {
                    $scope.loading = false;
                    $scope.departmentHeads = res.data.departmentHeads;
                    $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                })
                .catch(function (err) {
                    console.log(err)
                });
        }

        // VIEWING PAST EMPLOYEE INFOS + PAGINATION
        if ($state.current.name === 'sideboard.viewall-pastemployees') {
            $scope.pastEmployees = [];
            $scope.loading = true;
            getPastEmployeesData();
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

        function getPastEmployeesData() {
            branchService
                .getPastEmployees(currBranch.branchDetails.branchId, $scope.currentPage, $scope.pageSize)
                .then(function (res) {
                    $scope.loading = false;
                    $scope.pastEmployees = res.data.previousEmployeesData;
                    $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        // VIEWING BRANCH ANALYTICS
        var today = new Date();
        $scope.year = today.getFullYear();

        $scope.selectedMonth = moment().month() + 1;
        $scope.selectedYear = parseInt(moment().format('YYYY'));

        var chartOptions = {
            responsive: true,
            title: {
                display: true,
                text: 'Attendance Performance',
            },
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Week',
                        },
                    },
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Performance',
                        },
                    },
                ],
            },
            legend: {
                display: true,
                position: 'bottom',
            },
        }

        if ($state.current.name === 'sideboard.analytics') {
            $scope.loading = true;
            $scope.updateData = function (month, year) {
                $scope.selectedMonth = moment(month, 'MMMM').month() + 1;
                $scope.selectedYear = parseInt(year);
                // console.log($scope.selectedMonth, $scope.selectedYear);

                companyService
                    .getMonthYearPerformance(currBranch.companyDetails.companyId, $scope.selectedMonth, $scope.selectedYear)
                    .then(function (res) {
                        // console.log(res.data.monthData)
                        if (res.data.monthData.length !== 0) {

                            var data = res.data.monthData;

                            var chartData = {};

                            data.forEach(function (item) {
                                var branchId = item._id.branch;
                                var week = item._id.week;
                                var performance = item.performance;

                                if (!chartData[branchId]) {
                                    chartData[branchId] = [];
                                }

                                chartData[branchId][week] = performance;
                            });

                            var labels = Object.keys(chartData);

                            var datasets = labels.map(function (branchId) {
                                return {
                                    label: branchId,
                                    data: chartData[branchId],
                                    fill: false,
                                    borderColor: getRandomColor(),
                                    tension: 0.1,
                                }
                            });

                            new Chart('workingChart', {
                                type: 'line',
                                data: {
                                    labels: Array.from(Array(datasets[0].data.length).keys()),
                                    datasets: datasets,
                                },
                                options: chartOptions
                            })
                            // console.log(Array.from(Array(datasets[0].data.length).keys()));


                        } else {
                            new Chart('workingChart', {
                                type: 'line',
                                options: chartOptions
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

                companyService
                    .getMonthYearRatios(currBranch.companyDetails.companyId, currBranch.branchDetails.branchId, $scope.selectedMonth, $scope.selectedYear)
                    .then(function (res) {
                        $scope.monthRatios = res.data.monthRatios;
                        console.log($scope.monthRatios);
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
                $scope.loading = false;
            }

            var getMonthYearPerformance = companyService.getMonthYearPerformance(currBranch.companyDetails.companyId, $scope.selectedMonth, $scope.selectedYear);
            var getMonthYearRatios = companyService.getMonthYearRatios(currBranch.companyDetails.companyId, currBranch.branchDetails.branchId, $scope.selectedMonth, $scope.selectedYear);

            $q
                .all([getMonthYearPerformance, getMonthYearRatios])
                .then(function (res) {
                    // console.log(res.data.monthData)

                    if (res[0].data.monthData.length !== 0) {

                        var data = res[0].data.monthData;

                        var chartData = {};

                        data.forEach(function (item) {
                            var branchId = item._id.branch;
                            var week = item._id.week;
                            var performance = item.performance;

                            if (!chartData[branchId]) {
                                chartData[branchId] = [];
                            }

                            chartData[branchId][week] = performance;
                        });

                        var labels = Object.keys(chartData);

                        var datasets = labels.map(function (branchId) {
                            return {
                                label: branchId,
                                data: chartData[branchId],
                                fill: false,
                                borderColor: getRandomColor(),
                                tension: 0.1,
                            }
                        });

                        new Chart('workingChart', {
                            type: 'line',
                            data: {
                                labels: Array.from(Array(datasets[0].data.length).keys()),
                                datasets: datasets,
                            },
                            options: chartOptions
                        })
                        // console.log(Array.from(Array(datasets[0].data.length).keys()));
                    } else {
                        new Chart('workingChart', {
                            type: 'line',
                            options: chartOptions
                        })
                    }

                    $scope.monthRatios = res[1].data.monthRatios;
                    $scope.loading = false;
                })
                .catch(function (err) {
                    console.log(err);
                    $scope.loading = true;
                })
        }

        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // MORE DETAILS FOR SOME EMPLOYEE
        $scope.moreDetailsEmployee = function (employee) {
            $rootScope.specificEmployee = employee;
            $state.go("sideboard.employee", { employee_id: employee._id });
            // console.log(employee)
        }

        // CREATING A NEW EMPLOYEE MODAL
        $scope.openNewEmployeeModal = function () {
            $http.get('#newEmployeeModal').modal('show');
        };

        $scope.addNewEmployee = function ($event) {
            $event.preventDefault();
            $scope.employee.companyid = currBranch.companyDetails.companyId;
            $scope.employee.companyname = currBranch.companyDetails.companyName;
            $scope.employee.branchid = currBranch.branchDetails.branchId;
            $scope.employee.branchname = currBranch.branchDetails.branchName;
            $scope.employee.branchcity = currBranch.branchDetails.branchCity;
            // console.log($scope.employee.department);
            console.log($scope.employee);

            branchService
                .createEmployee($scope.employee)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };

        // UPDATING BRANCH ADMIN INFO MODAL
        $scope.openUpdateBranchAdminModal = function () {

            branchService
                .getBranchAdmin(currBranch.branchDetails.branchId)
                .then(function (res) {
                    $scope.branchadmin = res.data.adminData;
                    $scope.branchadmin.password = ''
                    // console.log($scope.superadmin);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#updateBranchAdminModal').modal('show');
        };

        $scope.updateBranchAdmin = function ($event) {
            $event.preventDefault();
            $scope.branchadmin.branchid = currBranch.branchDetails.branchId;
            $scope.branchadmin.companyid = currBranch.companyDetails.companyId;
            // console.log($scope.branchadmin);
            branchService
                .updateBranchAdmin($scope.branchadmin)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };

        
        // getting department list of branch
        if(!$rootScope.departments || !$rootScope.creationDate) {
            $rootScope.departments = [];
            companyService
                .getBranch(currBranch.branchDetails.branchId)
                .then(function (res) {
                    $rootScope.departments = res.data.branchData.departments;
                    $rootScope.creationDate = res.data.branchData.createdAt;
                })
                .catch(function (err) {
                    console.log(err)
                })
        }

        // CHANGE PASSWORD MODAL
        $scope.openSetPasswordModal = function () {
            $http.get('#setPasswordModal').modal('show');
        };

        $scope.newPassword = '';
        $scope.confirmPassword = '';
        
        $scope.changePassword = function ($event) {
            $event.preventDefault();

            var newDetails = {
                id: currBranch.userId,
                password: $scope.newPassword
            }
            branchService
                .changePassword(newDetails)
                .then(function (res) {
                    // console.log(res.data.data);
                    alert(res.data.message);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        $element.on('hidden.bs.modal', function () {
            $scope.$apply(function () {
                $scope.newPassword = '';
                $scope.confirmPassword = '';
            });
        })

        $scope.errorMessages = {
            required: 'This field is required.',
            pattern: 'Invalid format.',
        };
    }
])