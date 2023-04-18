///<reference path="../app.js" />

app.controller('employeeCtrl', [
    '$scope',
    '$http',
    '$window',
    '$state',
    '$rootScope',
    'employeeService',
    'hrService',
    function ($scope, $http, $window, $state, $rootScope, employeeService, hrService) {

        var currUser = JSON.parse(localStorage.getItem('user'));
        $scope.viewName = currUser.firstName + ' ' + currUser.lastName;

        $scope.startDate = new Date(moment());
        $scope.endDate = new Date(moment());
        $scope.duration = null;
        $scope.leaveTypeList = ['casual', 'sick', 'personal', 'vacation', 'emergency'];
        $scope.leave = {};

        $scope.currentPage = 1;
        $scope.pageSize = 5;
        $scope.totalPages = 1;

        // var currTime = JSON.parse(localStorage.getItem('timeIn'));

        // $scope.timeIn = localStorage.getItem('timeIn');
        $scope.timeIn = JSON.parse(localStorage.getItem('timeIn'));
        $scope.timeOut = localStorage.getItem('timeOut');

        $scope.employeeDetails = {};
        $scope.data = null;

        // $scope.punchTimeIn = moment(new Date($scope.timeIn.timeIn)).format('DD-MM-YYYY h:mm:ss a');
        // console.log($scope.timeIn);
        // console.log($scope.timeOut);

        // applying for leave
        $scope.calculateDuration = function () {
            if ($scope.startDate && $scope.endDate) {
                var start = moment($scope.startDate);
                var end = moment($scope.endDate);
                var duration = 0;

                while (start.isSameOrBefore(end)) {
                    if (start.day() !== 0 && start.day() !== 6) {
                        duration++;
                    }
                    start.add(1, 'd')
                }

                $scope.duration = duration;
            } else {
                $scope.duration = null;
            }
        };

        $scope.$watchGroup(['startDate', 'endDate'], function () {
            $scope.calculateDuration();
        });


        $scope.applyLeave = function () {
            $scope.leave.employeeId = currUser.userId;
            $scope.leave.employeeEmail = currUser.employeeEmail;
            $scope.leave.employeeName = $scope.viewName;
            $scope.leave.managerId = currUser.reportingManager.managerId;
            $scope.leave.managerName = currUser.reportingManager.managerName;
            $scope.leave.branchId = currUser.branchDetails.branchId;
            $scope.leave.branchName = currUser.branchDetails.branchName;
            $scope.leave.branchCity = currUser.branchDetails.branchCity;
            $scope.leave.companyId = currUser.companyDetails.companyId;
            $scope.leave.companyName = currUser.companyDetails.companyName;
            $scope.leave.leaveType = $scope.leaveType;
            $scope.leave.startDate = $scope.startDate;
            $scope.leave.endDate = $scope.endDate;
            $scope.leave.duration = $scope.duration;
            $scope.leave.comments = $scope.comments;

            console.log($scope.leave);
            employeeService
                .applyLeave($scope.leave)
                .then(function (res) {
                    // console.log(res)
                    if (res.status === 201) {
                        $window.alert('Leave applied successfully!');
                        // $route.reload();
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
        }


        // marking the attendance
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

        // getting leaves data
        if ($state.current.name === 'menu.leave.my-leaves') {
            $scope.leavesInfo = [];

            getLeavesInfo();
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
                getLeavesInfo();
            };
        }

        function getLeavesInfo() {
            employeeService
                .getLeavesInfo(currUser.userId, currUser.branchDetails.branchId, $scope.currentPage, $scope.pageSize)
                .then(function (res) {
                    $scope.leavesInfo = res.data.leaveData;
                    $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                    // console.log($scope.leavesInfo);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        // getting leaves that need to be approved
        if ($state.current.name === 'menu.leave.approve-leaves') {

            $scope.leavesToApprove = [];
            getLeavesToApprove();
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
                getLeavesToApprove();
            };



            // approving leaves
            $scope.approveRequest = function (leave) {
                console.log('approved');
                console.log(leave);
                var leaveData = {}
                leaveData.status = 'approved';
                leaveData.startDate = leave.leaveDetails.startDate;
                leaveData.endDate = leave.leaveDetails.endDate;
                // console.log(leaveData);
                employeeService
                    .updatingLeaveStatus(leave._id, leaveData) // Pass leaveData object as the second argument
                    .then(function (res) {
                        console.log(res);
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }

            // rejecting leaves
            $scope.rejectRequest = function (leave) {
                console.log('rejected');
                var leaveData = {}
                leaveData.status = 'rejected';
                leaveData.startDate = leave.leaveDetails.startDate;
                leaveData.endDate = leave.leaveDetails.endDate;
                employeeService
                    .updatingLeaveStatus(leave._id, leaveData) // Pass leaveData object as the second argument
                    .then(function (res) {
                        console.log(res);
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        }

        function getLeavesToApprove() {
            employeeService
                .getLeavesToApprove(currUser.userId, currUser.branchDetails.branchId, $scope.currentPage, $scope.pageSize)
                .then(function (res) {
                    $scope.leavesToApprove = res.data.leavesToApprove;
                    $scope.totalPages = Math.ceil(res.data.totalCount / $scope.pageSize);
                    // console.log($scope.leavesToApprove)
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        if ($state.current.name === 'menu.dashboard') {
            hrService
                .getEmployeeInfo(currUser.userId)
                .then(function (res) {
                    $scope.myData = res.data.employeeData;

                })
                .catch(function (err) {
                    console.log(err);
                })


        }

        // UPDATING BRANCH ADMIN INFO MODAL
        $scope.openUpdateModal = function () {
            hrService
                .getEmployeeInfo(currUser.userId)
                .then(function (res) {
                    $scope.employee = res.data.employeeData;
                    console.log(res.data)
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#updateBranchAdminModal').modal('show');
        };

        $scope.updateData = function ($event) {
            $event.preventDefault();

            console.log($scope.employee);
            hrService
                .updateEmployeeInfo($scope.employee)
                .then(function (res) {
                    // console.log(res.data)
                    alert(res.data.message);
                })
                .catch(function (err) {
                    console.log(err);
                })
        };


        // CHANGE PASSWORD MODAL
        $scope.openSetPasswordModal = function () {
            $http.get('#setPasswordModal').modal('show');
        };


        $scope.changePassword = function ($event) {
            $event.preventDefault();

            var newDetails = {
                id: currUser.userId,
                password: $scope.newPassword
            }
            hrService
                .changePassword(newDetails)
                .then(function (res) {
                    // console.log(res.data.data);
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

    }
]);