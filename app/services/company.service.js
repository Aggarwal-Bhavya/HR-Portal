///<reference path="../app.js" />

app.factory('companyService', [
    '$http',
    function ($http) {
        var url = "";
        return {
            getCompany: function (id) {
                url = 'http://localhost:5000/api/superadmin/company/' + id;
                return $http.get(url);
            },
            updateCompany: function (user) {
                url = 'http://localhost:5000/api/superadmin/update-company-info/' + user._id;
                return $http.put(url, user);
            },
            getAllBranches: function (id, currPage, pageSize) {
                url = 'http://localhost:5000/api/company/all-branches/' + id;
                return $http.get(url, {
                    params:
                    {
                        page: currPage,
                        count: pageSize
                    }
                });
            },
            getAllCompanyEmployees: function (id, currPage, pageSize) {
                url = 'http://localhost:5000/api/branch/all-company-employees/' + id;
                return $http.get(url, {
                    params:
                    {
                        page: currPage,
                        count: pageSize
                    }
                });
            },
            createBranch: function (user) {
                url = 'http://localhost:5000/api/company/create-branch';
                return $http.post(url, user);
            },
            getCompanyAdmin: function (id) {
                url = 'http://localhost:5000/api/company/company-admin-info/' + id;
                return $http.get(url);
            },
            putCompanyAdmin: function (user) {
                url = 'http://localhost:5000/api/company/update-companyadmin';
                return $http.put(url, user);
            },
            getBranch: function (id) {
                url = 'http://localhost:5000/api/company/branch/' + id;
                return $http.get(url);
            },
            updateBranch: function (user) {
                url = 'http://localhost:5000/api/company/update-branch-info/' + user._id;
                return $http.put(url, user);
            },
            getBranchHead: function (id, branchId) {
                url = 'http://localhost:5000/api/company/branch-head/' + id + '/' + branchId;
                // url = 'http://localhost:5000/api/company/branch-admin-info' + '/' + id;
                return $http.get(url);
            },
            getCompanyHeadCount: function (id) {
                url = 'http://localhost:5000/api/company/company-head-count/' + id;
                return $http.get(url);
            },
            getBranchesPerformance: function(id, year) {
                url = 'http://localhost:5000/api/company/branch-performance/' + id + '/' + year;
                return $http.get(url);
            },
            getMonthYearPerformance: function(id, month, year) {
                url = 'http://localhost:5000/api/company/monthly-performance/' + id + '/' + month + '/' + year;
                return $http.get(url);
            },
            getMonthYearRatios: function(compId, branchId, month, year) {
                url = 'http://localhost:5000/api/company/monthly-ratios/' + compId + '/' + branchId + '/' + month + '/' + year;
                return $http.get(url);
            },
            changePassword: function(password) {
                // console.log(password);
                url = 'http://localhost:5000/api/company/change-password';
                return $http.put(url, password);
            }
        }
    }
])