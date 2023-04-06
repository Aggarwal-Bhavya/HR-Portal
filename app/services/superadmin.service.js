///<reference path="../app.js" />

app.factory('superadminService', [
    '$http',
    function($http) {
        var url = "";

        return {
            getAllCompanies: function(currPage, pageSize) {
                url = 'http://localhost:5000/api/superadmin/all-companies';
                return $http.get(url, {
                    params:
                    {
                        page: currPage,
                        count: pageSize
                    }
                });
            },
            getAllInactiveCompanies: function(currPage, pageSize) {
                url = 'http://localhost:5000/api/superadmin/inactive-companies';
                return $http.get(url, {
                    params:
                    {
                        page: currPage,
                        count: pageSize
                    }
                });
            },
            getCompany: function(id) {
                url = 'http://localhost:5000/api/superadmin/company/' + id;
                return $http.get(url);
            },
            updateCompany: function(user) {
                url = 'http://localhost:5000/api/superadmin/update-company-info/' + user._id;
                return $http.put(url, user);
            },
            deactivateCompany: function(id) {
                url = 'http://localhost:5000/api/superadmin/deactivate-company/' + id;
                return $http.put(url);
            },
            activateCompany: function(id) {
                url = 'http://localhost:5000/api/superadmin/activate-company/' + id;
                return $http.put(url);
            },
            getSuperadmin: function() {
                url = 'http://localhost:5000/api/superadmin/superadmin-info';
                return $http.get(url);
            },
            updateSuperadmin: function(user) {
                url = 'http://localhost:5000/api/superadmin/update-info/';
                return $http.put(url, user);
            },
            createCompany: function(user) {
                url = 'http://localhost:5000/api/superadmin/create-company';
                return $http.post(url, user);
            },
            changePassword: function(password) {
                // console.log(password);
                url = 'http://localhost:5000/api/superadmin/change-password';
                return $http.put(url, password);
            }
        }
    }
])