///<reference path="../app.js" />

app.controller('employeeDetailsCtrl', [
    '$scope',
    '$rootScope',
    '$stateParams',
    '$rootScope',
    '$window',
    '$http',
    '$q',
    'branchService',
    'employeeService',
    function ($scope, $rootScope, $stateParams, $rootScope, $window, $http, $q, branchService, employeeService) {
        var employeeId = $stateParams.employee_id;

        $scope.loading = true;

        var today = new Date();
        $scope.year = today.getFullYear();

        $scope.selectedMonth = moment().month() + 1;
        $scope.selectedYear = parseInt(moment().format('YYYY'));

        var workingHoursChartOptions = {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Hours Worked'
                        },
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            max: 12
                        }
                    }
                ]
            },
            title: {
                display: true,
                text: "Hours worked for",
                position: 'bottom'
            }
        }

        $scope.updateData = function (month, year) {
            $scope.selectedMonth = moment(month, 'MMMM').month() + 1;
            $scope.selectedYear = parseInt(year);

            employeeService
                .getHoursWorked(employeeId, $scope.selectedMonth, $scope.selectedYear)
                .then(function (res) {
                    $scope.hoursData = res.data.hoursData;
                    // console.log($scope.hoursData)
                    var dateLabels = [];
                    var hoursData = [];

                    for (var i = 0; i < $scope.hoursData.length; i++) {
                        dateLabels.push(moment($scope.hoursData[i].present.date).format('DD'));
                        hoursData.push($scope.hoursData[i].present.hoursWorked);
                    }

                    new Chart('workingChart', {
                        type: "line",
                        data: {
                            labels: dateLabels,
                            datasets: [{
                                label: 'Hours Worked',
                                data: hoursData,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                                fill: false,
                                tension: 0.2
                            }]
                        },
                        options: workingHoursChartOptions
                    })
                })
                .catch(function (err) {
                    console.log(err);
                })

            employeeService
                .getWorkStatus(employeeId, $scope.selectedMonth, $scope.selectedYear)
                .then(function (res) {
                    $scope.statusData = res.data.statusData;

                    var statusLabels = [];
                    var statusCount = [];

                    for (var i = 0; i < $scope.statusData.length; i++) {
                        statusLabels.push($scope.statusData[i]._id);
                        statusCount.push($scope.statusData[i].count);
                    }

                    new Chart('statusChart', {
                        type: 'doughnut',
                        data: {
                            labels: statusLabels,
                            datasets: [{
                                label: 'Hours Worked',
                                data: statusCount,
                                backgroundColor: getColorArrayForStatus(statusLabels),
                            }]
                        },
                        options: {
                            responsive: true,
                            legend: {
                                display: true
                            },
                            title: {
                                display: true,
                                text: "Attendance Status Count",
                                position: 'bottom'
                            }
                        }
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })

            employeeService
            .monthlyStats(employeeId, $scope.selectedMonth, $scope.selectedYear)
            .then(function (res) {
                if(res.data.monthData.length !== 0) {
                    var data = res.data.monthData[0];
                    $scope.leavesApplied = data.totalLeavesApplied;
                    $scope.approvedLeaves = data.approvedLeaves;
                    $scope.rejectedLeaves = data.rejectedLeaves;
                    $scope.avgDuration = data.avgDuration;
                } else {
                    $scope.leavesApplied =  $scope.approvedLeaves = $scope.rejectedLeaves =  $scope.avgDuration = 0;
                }
            })
            .catch(function (err) {
                console.log(err)
            })
        }


        var getEmployeeInfo = branchService.getEmployeeInfo(employeeId);
        var getHoursWorked = employeeService.getHoursWorked(employeeId, $scope.selectedMonth, $scope.selectedYear);
        var getWorkStatus = employeeService.getWorkStatus(employeeId, $scope.selectedMonth, $scope.selectedYear);
        var yearlyRatios = employeeService.yearlyRatios(employeeId, $scope.year);
        var monthlyStats = employeeService.monthlyStats(employeeId, $scope.selectedMonth, $scope.selectedYear);

        $q
            .all([getEmployeeInfo, getHoursWorked, getWorkStatus, yearlyRatios, monthlyStats])
            .then(function (res) {
                $scope.loading = false;

                $rootScope.specificEmployee = res[0].data.employeeData;
                $scope.employeeData = $rootScope.specificEmployee;

                $scope.hoursData = res[1].data.hoursData;
                $scope.statusData = res[2].data.statusData;
                var yearlyRatios = res[3].data.yearData;
            
                if(res[4].data.monthData.length !== 0) {
                    var data = res[4].data.monthData[0];
                    $scope.leavesApplied = data.totalLeavesApplied;
                    $scope.approvedLeaves = data.approvedLeaves;
                    $scope.rejectedLeaves = data.rejectedLeaves;
                    $scope.avgDuration = data.avgDuration;
                } else {
                    $scope.leavesApplied =  $scope.approvedLeaves = $scope.rejectedLeaves =  $scope.avgDuration = 0;
                }

                var joinedAt = new Date($scope.employeeData.createdAt);
                if ($scope.employeeData.dateOfLeaving) {
                    activeDays(new Date($scope.employeeData.dateOfLeaving), joinedAt);
                } else {
                    activeDays(moment(), joinedAt);
                }

                var workingDays = workingDaysInYear($scope.year);
                
                yearlyStats(yearlyRatios, workingDays);

                var dateLabels = [];
                var hoursData = [];

                for (var i = 0; i < $scope.hoursData.length; i++) {
                    dateLabels.push(moment($scope.hoursData[i].present.date).format('DD'));
                    hoursData.push($scope.hoursData[i].present.hoursWorked);
                }

                new Chart('workingChart', {
                    type: "line",
                    data: {
                        labels: dateLabels,
                        datasets: [{
                            label: 'Hours Worked',
                            data: hoursData,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            fill: false,
                            tension: 0.2
                        }]
                    },
                    options: workingHoursChartOptions
                });


                var statusLabels = [];
                var statusCount = [];

                for (var i = 0; i < $scope.statusData.length; i++) {
                    statusLabels.push($scope.statusData[i]._id);
                    statusCount.push($scope.statusData[i].count);
                }

                new Chart('statusChart', {
                    type: 'doughnut',
                    data: {
                        labels: statusLabels,
                        datasets: [{
                            label: 'Hours Worked',
                            data: statusCount,
                            backgroundColor: getColorArrayForStatus(statusLabels),
                        }]
                    },
                    options: {
                        responsive: true,
                        legend: {
                            display: true
                        },
                        title: {
                            display: true,
                            text: "Attendance Status Count",
                            position: 'bottom'
                        }
                    }
                });
            })
            .catch(function (err) {
                console.log(err);
                $scope.loading = true;
            })

        function getColorArrayForStatus(statusLabels) {
            var colors = [];
            statusLabels.forEach(function (label) {
                switch (label) {
                    case 'present':
                        colors.push('#48e248');
                        break;
                    case 'leave':
                        colors.push('#ff4c4c');
                        break;
                    case 'half-day':
                        colors.push('#feaf1f');
                        break;
                    case 'pending':
                        colors.push('#8b93e3');
                        break;
                    default:
                        colors.push('grey');
                        break;
                }
            })
            return colors;
        };

        function activeDays(date1, date2) {
            var diffInDays = moment(date1).diff(date2, 'days');
            if (diffInDays <= 30) {
                $scope.active = diffInDays + ' days';
            } else if (diffInDays > 30 && diffInDays <= 365) {
                $scope.active = Math.floor(diffInDays / 30) + ' months';
            } else {
                $scope.active = Math.floor(diffInDays / 365) + ' years';
            }
        };

        function yearlyStats(yearlyRatios, workingDays) {
            if (yearlyRatios.length === 0) {
                $scope.avgPerformance = 0;
                $scope.presentCount = 0;
                $scope.presentRate = 0;
                $scope.leaveRate = 0;
            } else {
                $scope.avgPerformance = (yearlyRatios[0].totalHoursWorked / workingDays).toFixed(2);
                $scope.presentCount = yearlyRatios[0].totalPresents;
                $scope.presentRate = ((yearlyRatios[0].totalPresents / workingDays) * 100).toFixed(2);
                $scope.leaveRate = ((yearlyRatios[0].totalLeaves / workingDays) * 100).toFixed(2);
            }
        }

        function workingDaysInYear(year) {
            var daysInYear = moment(`${year}-12-31`).dayOfYear();
            var workingDays = daysInYear;
            for (var i = 1; i <= daysInYear; i++) {
                var date = moment(`${year}-01-01`).dayOfYear(i);
                if (date.day() === 0 || date.day() === 6) {
                    workingDays--;
                }
            }
            return workingDays;
        }

        // EDIT EMPLOYEE INFO MODAL
        $scope.openEditModal = function (employee) {
            // console.log(employee._id);
            branchService
                .getEmployeeInfo(employeeId)
                .then(function (res) {
                    $scope.employee = res.data.employeeData;
                    // console.log($scope.employee);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#editModal').modal('show');
        };

        $scope.saveData = function ($event) {
            $event.preventDefault();

            branchService
                .updateEmployeeInfo($scope.employee)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err);
                })
        };

        // REMOVE EMPLOYEE MODAL
        $scope.openDeleteModal = function (employee) {
            branchService
                .getEmployeeInfo(employeeId)
                .then(function (res) {
                    $scope.employee = res.data.employeeData;
                    // console.log($scope.company);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#deleteModal').modal('show');
        };

        $scope.deleteData = function ($event) {
            $event.preventDefault();

            branchService
                .removeEmployee($scope.employee._id)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };
    }
]);