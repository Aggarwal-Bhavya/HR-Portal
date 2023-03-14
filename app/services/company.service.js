///<reference path="../app.js" />

app.factory('companyService', [
    '$http',
    function($http) {
        var url = "";
        return {
            getCompany: function(id) {
                url = 'http://localhost:5000/api/company/company-info/' + id;
                return $http.get(url);
            },
            updateCompany: function(user) {
                url = 'http://localhost:5000/api/company/update-company-info/' + user._id;
                return $http.put(url, user);
            },
            getAllBranches: function(id) {
                url = 'http://localhost:5000/api/company/all-branches/' + id;
                return $http.get(url);
            }, 
            createBranch: function(user) {
                url = 'http://localhost:5000/api/company/create-branch';
                return $http.post(url, user);
            },
            getCompanyAdmin: function(id) {
                url = 'http://localhost:5000/api/company/company-admin-info/' + id;
                return $http.get(url);
            },
            putCompanyAdmin: function(user) {
                url = 'http://localhost:5000/api/company/update-companyadmin';
                return $http.put(url, user);
            },
            getBranch: function(id) {
                url = 'http://localhost:5000/api/company/branch/' + id;
                return $http.get(url);
            },
            updateBranch: function(user) {
                url = 'http://localhost:5000/api/company/update-branch-info/' + user._id;
                return $http.put(url, user);
            },
            getBranchHeads: function(id) {
                url = 'http://localhost:5000/api/company/all-branch-heads/' + id;
                return $http.get(url);
            }
        }
    }
])