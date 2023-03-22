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
            }
        }
    }
]);