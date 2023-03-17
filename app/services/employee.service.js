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
            }
        }
    }
]);