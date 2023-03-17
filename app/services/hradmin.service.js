///<reference path="../app.js" />

app.factory('hrService', [
    '$http',
    function ($http) {
        var url = "";
        return {
            getAllEmployees: function(id) {
                url = 'http://localhost:5000/api/hradmin/all-employees/' + id;
                return $http.get(url);
            },
            getDepartmentHeads: function(id) {
                url = 'http://localhost:5000/api/hradmin/department-heads/' + id;
                return $http.get(url);
            },
            getEmployeeInfo: function(id) {
                url = 'http://localhost:5000/api/hradmin/employee-info/' + id;
                return $http.get(url);
            },
            updateEmployeeInfo: function(user) {
                url = 'http://localhost:5000/api/hradmin//update-employee-info/' + user._id;
                return $http.put(url, user);
            },
            getBranchDepartments: function(id) {
                url = 'http://localhost:5000/api/hradmin/branch-departments/' + id;
                return $http.get(url);
            },
            removeEmployee: function(id) {
                url = 'http://localhost:5000/api/hradmin/remove-employee/' + id;
                return $http.put(url);
            },
            getPastEmployees: function(id) {
                url = 'http://localhost:5000/api/hradmin/all-previous-employees/' + id;
                return $http.get(url);
            },
            createEmployee: function(user) {
                url = 'http://localhost:5000/api/hradmin/new-employee';
                return $http.post(url, user);
            },
        }
    }
])