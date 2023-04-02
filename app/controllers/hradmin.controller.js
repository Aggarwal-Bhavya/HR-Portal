///<reference path="../app.js" />

app.controller('hrAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    '$state',
    '$rootScope',
    'employeeService',
    'hrService',
    function ($scope, $http, $window, $state, $rootScope, employeeService, hrService) {
        $scope.hradmin = {};
        $scope.departmentHeads = [];
        $scope.employees = [];
        $scope.pastEmployees = [];

        $scope.maritalStatuses = ["married", "single", "rda"];
        $scope.employeeRoles = ["departmenthead", "employee"];
        $scope.genders = ["male", "female", "other", "rda"];


        var currUser = JSON.parse(localStorage.getItem('user'));
        $scope.viewName = currUser.firstName + ' ' + currUser.lastName;
        // console.log($scope.viewname);

        $scope.currentPage = 1;
        $scope.pageSize = 5;
        $scope.totalPages = 1;

        // VIEWING ALL EMPLOYEES + PAGINATION
        if ($state.current.name === 'sidemenu.viewall' || $state.current.name === 'sidemenu.dashboard') {
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
            hrService
                .getAllEmployees(currUser.branchDetails.branchId, $scope.currentPage, $scope.pageSize)
                .then(function (res) {
                    $scope.loading = false;
                    $scope.employees = res.data.branchData;
                    $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        hrService
            .getBranchDepartments(currUser.branchDetails.branchId)
            .then(function (res) {
                $scope.branchDepts = res.data.departments;
                // console.log($scope.branchDepts.departments)
            })
            .catch(function (err) {
                console.log(err)
            })


        // VIEWING DEPARTMENT HEADS INFO + PAGINATION
        if ($state.current.name === 'sidemenu.viewall-deptheads') {
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
            hrService
                .getDepartmentHeads(currUser.branchDetails.branchId, $scope.currentPage, $scope.pageSize)
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
        if ($state.current.name === 'sidemenu.viewall-pastemployees') {
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
            hrService
                .getPastEmployees(currUser.branchDetails.branchId, $scope.currentPage, $scope.pageSize)
                .then(function (res) {
                    $scope.loading = false;
                    $scope.pastEmployees = res.data.previousEmployeesData;
                    $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        // MORE DETAILS FOR SOME EMPLOYEE
        $scope.moreDetailsEmployee = function (employee) {
            $rootScope.specificEmployee = employee;
            // console.log(employee)
            $state.go("sidemenu.employee", { employee_id: employee._id });
            // console.log(employee)
        }

        // marking the attendance
        $scope.employeeDetails = {};
        $scope.timeIn = JSON.parse(localStorage.getItem('timeIn'));
        $scope.timeOut = localStorage.getItem('timeOut');

        $scope.TimeIn = function () {
            $scope.employeeDetails.employeeId = currUser.userId;
            $scope.employeeDetails.employeeEmail = currUser.employeeEmail;
            $scope.employeeDetails.employeeName = $scope.viewName;
            $scope.employeeDetails.managerId = currUser.reportingManager.managerId;
            $scope.employeeDetails.managerName = currUser.reportingManager.managerName;
            $scope.employeeDetails.branchId = currUser.branchDetails.branchId;
            $scope.employeeDetails.branchName = currUser.branchDetails.branchName;
            $scope.employeeDetails.branchCity = currUser.branchDetails.branchCity;
            $scope.employeeDetails.companyId = currUser.companyDetails.companyId;
            $scope.employeeDetails.companyName = currUser.companyDetails.companyName;

            // console.log($scope.employeeDetails);

            employeeService
                .markTimeIn($scope.employeeDetails)
                .then(function (res) {
                    if (res.status === 201) {
                        console.log(res.data.clockInData._id);
                        console.log(res.data.clockInData.present.timeIn);
                        var timeInfo = {
                            timeIn: res.data.clockInData.present.timeIn,
                            timeId: res.data.clockInData._id
                        }
                        $scope.data = res.data.clockInData;
                        localStorage.setItem('timeIn', JSON.stringify(timeInfo));
                        localStorage.removeItem('timeOut')
                    }
                })
                .catch(function (err) {
                    // console.log(err)
                    if (err.status === 409) {
                        $window.alert('Attendance record already exists!');
                    } else {
                        console.log(err);
                    }
                })

        }

        $scope.TimeOut = function () {
            // console.log(JSON.parse(localStorage.getItem('timeIn')));
            $scope.userTime = {
                timeId: JSON.parse(localStorage.getItem('timeIn')).timeId,
                userId: currUser.userId
            }

            employeeService
                .markTimeOut($scope.userTime)
                .then(function (res) {
                    console.log(res);
                    console.log(res.data.attendanceData);
                    localStorage.setItem('timeOut', 'timedOut');
                    localStorage.removeItem('timeIn');
                })
                .catch(function (err) {
                    console.log(err)
                })
        }

        $scope.eventSources = [];

        $scope.calendarConfig = {
            width: 300,
            height: 500,
            editable: true,
            header: {
                left: 'prev, next, today',
                center: 'title',
                right: ''
            },
            firstDay: 1,
            viewRender: function (view, element) {

                var date = new Date(view.calendar.getDate());
                var year = date.getFullYear();
                var month = date.getMonth() + 1;

                employeeService
                    .getAttendance(currUser.userId, month, year)
                    .then(function (res) {
                        // console.log(res.data.record);
                        var events = res.data.record.map(function (attendance) {
                            var start = attendance.present ? moment(attendance.present.date) : moment(attendance.leave.date);
                            // console.log(start);
                            return {
                                title: attendance.status,
                                start: start,
                                color: getColorForStatus(attendance.status)
                            };
                        });
                        // console.log(events);

                        var today = moment();
                        var firstDayOfMonth = moment().startOf('year');

                        while (firstDayOfMonth.isBefore(today, 'd')) {
                            var isWeekend = firstDayOfMonth.isoWeekday() === 6 || firstDayOfMonth.isoWeekday() === 7;
                            var isUnmarked = events.every(function (event) {
                                return !moment(event.start).isSame(firstDayOfMonth, 'd');
                            });
                            if (isUnmarked) {
                                var title = isWeekend ? 'weekend' : 'leave';
                                events.push({
                                    title: title,
                                    start: firstDayOfMonth.clone(),
                                    color: getColorForStatus(title)
                                });
                            }
                            firstDayOfMonth.add(1, 'd');
                        }

                        $scope.eventSources = [events];
                        // console.log($scope.eventSources);


                        var cells = element.find('.fc-day');
                        cells.each(function () {
                            var cell = this;
                            var cellDate = moment(cell.getAttribute('data-date'));
                            events.forEach(function (event) {
                                var eventStart = moment(event.start);
                                if (cellDate.isSame(eventStart, 'day')) {
                                    cell.style.backgroundColor = event.color;
                                }
                            });
                        });

                    })
                    .catch(function (err) {
                        console.log(err);
                    });


                var dateLabels = [];
                var hoursData = [];

                var statusLabels = [];
                var statusCount = [];


                // getting data for hours worked to create a graph
                employeeService
                    .getHoursWorked(currUser.userId, month, year)
                    .then(function (res) {
                        // console.log(res);
                        $scope.hoursData = res.data.hoursData;
                        // console.log(moment($scope.hoursData[0].date).format('YYYY-MM-DD'))

                        for (var i = 0; i < $scope.hoursData.length; i++) {
                            dateLabels.push(moment($scope.hoursData[i].present.date).format('YYYY-MM-DD'));
                            hoursData.push($scope.hoursData[i].present.hoursWorked);
                        }

                        new Chart('hoursChart', {
                            type: "line",
                            data: {
                                labels: dateLabels,
                                datasets: [{
                                    label: 'Hours Worked',
                                    data: hoursData,
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    display: false
                                },
                                scales: {
                                    yAxes: [{
                                        display: true,
                                        ticks: {
                                            beginAtZero: true,
                                            max: 12
                                        }
                                    }]
                                },
                                title: {
                                    display: true,
                                    text: "Hours worked for",
                                    position: 'bottom'
                                }
                            }
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

                // work status graph
                employeeService
                    .getWorkStatus(currUser.userId, month, year)
                    .then(function (res) {
                        $scope.statusData = res.data.statusData;
                        for (var i = 0; i < $scope.statusData.length; i++) {
                            statusLabels.push($scope.statusData[i]._id);
                            statusCount.push($scope.statusData[i].count);
                        }
                        // console.log(statusLabels);


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
                    });

            }
        };

        function getColorForStatus(status) {
            switch (status) {
                case 'present':
                    return '#48e248';
                case 'leave':
                    return '#ff4c4c';
                case 'half-day':
                    return '#feaf1f';
                case 'pending':
                    return '#8b93e3';
                case 'weekend':
                    return '#f535818c';
                default:
                    return 'grey';
            }
        };

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

        // CREATING A NEW EMPLOYEE MODAL
        $scope.openNewEmployeeModal = function () {
            $http.get('#newEmployeeModal').modal('show');
        };

        $scope.addNewEmployee = function ($event) {
            $event.preventDefault();
            $scope.employee.companyid = currUser.companyDetails.companyId;
            $scope.employee.companyname = currUser.companyDetails.companyName;
            $scope.employee.branchid = currUser.branchDetails.branchId;
            $scope.employee.branchname = currUser.branchDetails.branchName;
            $scope.employee.branchcity = currUser.branchDetails.branchCity;
            // console.log($scope.employee.department);
            console.log($scope.employee);

            hrService
                .createEmployee($scope.employee)
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