///<reference path="../app.js" />

app.controller('employeeCtrl', [
    '$scope',
    '$http',
    '$window',
    'employeeService',
    function ($scope, $http, $window, employeeService) {
        var currUser = JSON.parse(localStorage.getItem('user'));
        $scope.viewName = currUser.firstName + ' ' + currUser.lastName;

        $scope.startDate = new Date(moment());
        $scope.endDate = new Date(moment());
        $scope.duration = null;
        $scope.leaveTypeList = ['Casual', 'Sick Leave', 'Personal Leave', 'Vacation', 'Emergency']
        $scope.leave = {};

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
                
                while(start.isSameOrBefore(end)) {
                    if(start.day() !== 0 && start.day() !== 6) {
                        duration++;
                    }
                    start.add(1, 'd')
                }

                $scope.duration = duration;
            } else {
                $scope.duration = null;
            }
        };

        $scope.$watchGroup(['startDate', 'endDate'], function() {
            $scope.calculateDuration();
        });


        $scope.applyLeave = function () {
            $scope.leave.leaveType = $scope.leaveType;
            $scope.leave.startDate = $scope.startDate;
            $scope.leave.endDate = $scope.endDate;
            $scope.leave.duration = $scope.duration;
            $scope.leave.comments = $scope.comments;

            console.log($scope.leave);
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
                        console.log(res.data.clockInData.timeIn);
                        var timeInfo = {
                            timeIn: res.data.clockInData.timeIn,
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
                        var events = res.data.record.map(function (attendance) {
                            var start = moment(attendance.date);
                            return {
                                title: attendance.status,
                                start: start,
                                color: getColorForStatus(attendance.status)
                            };
                        });

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
                        $scope.hoursData = res.data.hoursData;
                        // console.log(moment($scope.hoursData[0].date).format('YYYY-MM-DD'))

                        for (var i = 0; i < $scope.hoursData.length; i++) {
                            dateLabels.push(moment($scope.hoursData[i].date).format('YYYY-MM-DD'));
                            hoursData.push($scope.hoursData[i].hoursWorked);
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
    }
]);