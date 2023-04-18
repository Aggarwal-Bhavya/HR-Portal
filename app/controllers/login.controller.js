///<reference path="../app.js" />

app.controller('loginController', [
    '$scope',
    '$http',
    '$location',
    function ($scope, $http, $location) {
        $scope.loginUser = function () {
            console.log('allow login');
            // $location.path('/sidebar/superadmin');
            console.log($scope.user);
            $http
            .post('http://localhost:5000/api/login/check-login-info', $scope.user)
            .then(function(res) {
                // console.log(res.data.userData);
                // console.log(res.data.token);
                var userInfo = {
                    userId: res.data.userData._id,
                    employeeCode: res.data.userData.employeeCode,
                    firstName: res.data.userData.firstName,
                    lastName: res.data.userData.lastName,
                    employeeEmail: res.data.userData.employeeEmail,
                    department: res.data.userData.department,
                    employeeRole: res.data.userData.employeeRole,
                    isActive: res.data.userData.isActive,
                    companyDetails: res.data.userData.company,
                    branchDetails: res.data.userData.branch,
                    reportingManager: res.data.userData.reportingTo
                }
                localStorage.setItem('user', JSON.stringify(userInfo));
                localStorage.setItem('Authorization', 'Bearer ' + res.data.token);
                if(userInfo.employeeRole == 'superadmin' && userInfo.companyDetails.companyName == '') {
                    $location.path('/sidebar/superadmin');
                } else if(userInfo.employeeRole == 'companyadmin' && userInfo.companyDetails.companyName != '') {
                    $location.path('/sidepanel/company');
                } else if(userInfo.employeeRole == 'branchadmin' && userInfo.companyDetails.companyName != '' && userInfo.branchDetails.branchName != '') {
                    $location.path('/sideboard/branch');
                } else if(userInfo.employeeRole == 'hradmin' && userInfo.companyDetails.companyName != '' && userInfo.branchDetails.branchName != '') {
                    $location.path('/sidemenu/hradmin');
                } else if((userInfo.employeeRole == 'employee' || userInfo.employeeRole == 'departmenthead') && userInfo.companyDetails.companyName != '' && userInfo.branchDetails.branchName != '') {
                    $location.path('/menu/dashboard');
                }
            })
            .catch(function(err) {
                console.log(err);
                alert('Login failed. Retry!')
            })
        }
    }
])