///<reference path="../app.js" />

app.factory('employeeService', [
    '$http',
    function ($http) {
        var url = "";
        return {
            markTimeIn: function(user) {
                url = "http://localhost:5000/api/employee/mark-attendance";
                return $http.post(url, user);
            },
            markTimeOut: function(time) {
                url = 'http://localhost:5000/api/employee/time-out/' + time.timeId + '/' + time.userId;
                return $http.put(url);
            },
            getAttendance: function(empId, month, year) {
                url = 'http://localhost:5000/api/employee/month-attendance/' + empId + '/' + month + '/' + year;
                return $http.get(url);
            },
            getHoursWorked: function(empId, month, year) {
                url = 'http://localhost:5000/api/employee/hours-worked/' + empId + '/' + month + '/' + year;
                return $http.get(url);
            },
            getWorkStatus: function(empId, month, year) {
                url = 'http://localhost:5000/api/employee/attendance-status/' + empId + '/' + month + '/' + year;
                return $http.get(url);
            },
            applyLeave: function(leave) {
                url = 'http://localhost:5000/api/attendance/apply-leave';
                return $http.post(url, leave);
            },
            getLeavesInfo: function(empId, branchId, currPage, pageSize) {
                url = 'http://localhost:5000/api/attendance/get-leaves/' + empId + '/' + branchId;
                return $http.get(url, {
                    params:
                    {
                        page: currPage,
                        count: pageSize
                    }
                });
            },
            getLeavesToApprove: function(empId, branchId, currPage, pageSize) {
                url = 'http://localhost:5000/api/attendance/to-approve-leaves/' + empId + '/' + branchId;
                return $http.get(url, {
                    params:
                    {
                        page: currPage,
                        count: pageSize
                    }
                });
            },
            yearlyRatios: function(empId, year) {
                url = 'http://localhost:5000/api/employee/year-stats/' + empId + '/' + year;
                return $http.get(url);
            },
            monthlyStats: function(empId, month, year) {
                url = 'http://localhost:5000/api/employee/month-stats/' + empId + '/' + month + '/' + year;
                return $http.get(url);
            },
            updatingLeaveStatus: function(leaveId, leave) {
                url = 'http://localhost:5000/api/attendance/leave-status/' + leaveId;
                return $http.put(url, leave);
            }
        }
    }
]);