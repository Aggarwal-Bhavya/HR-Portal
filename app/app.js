
///<reference path="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.js" />

///<reference path="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-route.min.js" />
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.4.2/angular-ui-router.min.js" />

///<reference path="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js" />
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.0/fullcalendar.min.js" />
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-calendar/1.0.0/calendar.js" />

///<reference path="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js" />

///<reference path="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js" />


var app = angular.module("myApp", ["ui.router", "ui.calendar"]);

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
                console.log(res.data);
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
                if(userInfo.employeeRole == 'superadmin' && userInfo.companyDetails.companyName == '') {
                    $location.path('/sidebar/superadmin');
                } else if(userInfo.employeeRole == 'companyadmin' && userInfo.companyDetails.companyName != '') {
                    $location.path('/sidepanel/company');
                } else if(userInfo.employeeRole == 'branchadmin' && userInfo.companyDetails.companyName != '' && userInfo.branchDetails.branchName != '') {
                    $location.path('/sideboard/branch');
                } else if(userInfo.employeeRole == 'hradmin' && userInfo.companyDetails.companyName != '' && userInfo.branchDetails.branchName != '') {
                    $location.path('/sidemenu/hradmin');
                } else if((userInfo.employeeRole == 'employee' || userInfo.employeeRole == 'departmenthead') && userInfo.companyDetails.companyName != '' && userInfo.branchDetails.branchName != '') {
                    $location.path('/menu');
                }
            })
            .catch(function(err) {
                console.log(err);
            })
        }
    }
])