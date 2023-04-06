///<reference path="../app.js" />

app.controller('branchDetailsCtrl', [
    '$scope',
    '$rootScope',
    '$stateParams',
    '$rootScope',
    '$window',
    '$http',
    '$q',
    'companyService',
    function ($scope, $rootScope, $stateParams, $rootScope, $window, $http, $q, companyService) {
        var currCompany = JSON.parse(localStorage.getItem('user'));
        var branchId = $stateParams.branch_id;

        $scope.loading = true;

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

        $scope.updateData = function (month, year) {
            $scope.selectedMonth = moment(month, 'MMMM').month() + 1;
            $scope.selectedYear = parseInt(year);
            // console.log($scope.selectedMonth, $scope.selectedYear);

            companyService
                .getMonthYearPerformance(currCompany.companyDetails.companyId, $scope.selectedMonth, $scope.selectedYear)
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
                .getMonthYearRatios(currCompany.companyDetails.companyId, branchId, $scope.selectedMonth, $scope.selectedYear)
                .then(function (res) {
                    $scope.monthRatios = res.data.monthRatios;
                    console.log($scope.monthRatios);
                })
                .catch(function (err) {
                    console.log(err)
                })
        }


        var getBranch = companyService.getBranch(branchId);
        var getBranchesPerformance = companyService.getBranchesPerformance(currCompany.companyDetails.companyId, today.getFullYear());
        var getMonthYearPerformance = companyService.getMonthYearPerformance(currCompany.companyDetails.companyId, $scope.selectedMonth, $scope.selectedYear);
        var getMonthYearRatios = companyService.getMonthYearRatios(currCompany.companyDetails.companyId, branchId, $scope.selectedMonth, $scope.selectedYear);
        var getBranchHead = companyService.getBranchHead(currCompany.companyDetails.companyId, branchId);
        $q
            .all([getBranch, getBranchesPerformance, getMonthYearPerformance, getMonthYearRatios, getBranchHead])
            .then(function (res) {
                $scope.loading = false;

                $rootScope.specifcBranch = res[0].data.branchData;
                $scope.branchData = $rootScope.specifcBranch;

                $scope.branchPerformance = res[1].data.branch.find(function (element) {
                    return element.branchDetails.branchId == branchId
                });

                $scope.monthRatios = res[3].data.monthRatios;
                console.log($scope.monthRatios);

                $scope.branchHead = res[4].data.branchHead;
                console.log($scope.branchHead)

                var data = res[2].data.monthData;
                if (data.length !== 0) {
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


                    var datasets = Object.keys(chartData).map(function (branchId) {
                        return {
                            label: branchId,
                            data: chartData[branchId],
                            fill: false,
                            borderColor: getRandomColor(),
                            tension: 0.1,
                        }
                    });

                    var weekLabels = Array.from(Array(datasets[0].data.length).keys());
                    new Chart('workingChart', {
                        type: 'line',
                        data: {
                            // labels: Array.from(Array(datasets[0].data.length).keys()),
                            labels: weekLabels,
                            datasets: datasets,
                        },
                        options: chartOptions
                    })
                } else {
                    new Chart('workingChart', {
                        type: 'line',
                        options: chartOptions
                    })
                }



            })
            .catch(function (err) {
                $scope.loading = true;
                console.log(err);
            })

        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }


        // EDIT BRANCH INFO MODAL
        $scope.openEditModal = function (branch) {
            // console.log(branch._id);
            companyService
                .getBranch(branch._id)
                .then(function (res) {
                    $scope.branch = res.data.branchData;
                    // console.log($scope.branch);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#editModal').modal('show');
        };

        $scope.saveData = function ($event) {
            $event.preventDefault();
            if (typeof ($scope.branch.contactNumber) == "string") {
                $scope.branch.contactNumber = $scope.branch.contactNumber.split(",");
            }
            if (typeof ($scope.branch.departments) == "string") {
                $scope.branch.departments = $scope.branch.departments.split(",");
            }
            // console.log($scope.branch);

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

        // BRANCH ADMIN INFO
        $scope.openBranchAdminModal = function ($event) {
            companyService
                .getBranchHead(currCompany.companyDetails.companyId, branchId)
                .then(function (res) {
                    console.log(res.data.branchHead);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#branchAdminModal').modal('show');

        }
    }
]);