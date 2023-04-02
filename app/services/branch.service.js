///<reference path="../app.js" />

app.factory('branchService', [
    '$http',
    function($http) {
        var url = "";
        return {
            getBranchInfo: function(id) {
                url = "http://localhost:5000/api/company/branch/" + id;
                return $http.get(url);
            },
            getAllEmployees: function(id, currPage, pageSize) {
                url = "http://localhost:5000/api/branch/all-employees/" + id;
                return $http.get(url, {
                    params:
                    {
                        page: currPage,
                        count: pageSize
                    }
                });
            },
            createEmployee: function(user) {
                url = 'http://localhost:5000/api/branch/new-employee';
                return $http.post(url, user);
            },
            getAllDepartmentHeads: function(id, currPage, pageSize) {
                url = 'http://localhost:5000/api/branch/department-heads/' + id;
                return $http.get(url, {
                    params:
                    {
                        page: currPage,
                        count: pageSize
                    }
                });
            },
            getBranchAdmin: function(id) {
                url = 'http://localhost:5000/api/branch/branch-admin-info/' + id;
                return $http.get(url);
            },
            updateBranchAdmin: function(user) {
                url = 'http://localhost:5000/api/branch/update-branchadmin';
                return $http.put(url, user);
            },
            getEmployeeInfo: function(id) {
                url = 'http://localhost:5000/api/branch/employee-info/' + id;
                return $http.get(url);
            },
            updateEmployeeInfo: function(user) {
                url = 'http://localhost:5000/api/branch/update-employee-info/' + user._id;
                return $http.put(url, user);
            },
            getPastEmployees: function(id, currPage, pageSize) {
                url = 'http://localhost:5000/api/branch/all-previous-employees/' + id;
                return $http.get(url, {
                    params:
                    {
                        page: currPage,
                        count: pageSize
                    }
                });
            },
            removeEmployee: function(id) {
                url = 'http://localhost:5000/api/branch/remove-employee/' + id;
                return $http.put(url);
            }
        }
    }
])