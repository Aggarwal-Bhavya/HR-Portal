///<reference path="../app.js" />

app.controller('employeeCtrl', [
    '$scope',
    '$http',
    '$window',
    'employeeService',
    function ($scope, $http, $window, employeeService) {
        // $scope.timeInButton = true;
        // $scope.timeOutButton = false;
        $scope.timeOut = localStorage.getItem('timeOut');

        $scope.employeeDetails = {};


        var currUser = JSON.parse(localStorage.getItem('user'));
        // var currTimeIn = JSON.parse(localStorage.getItem('timeIn'));
        $scope.viewName = currUser.firstName + ' ' + currUser.lastName;

        // PUNCHING IN ATTENDANCE
        $scope.TimeIn = function () {
            $scope.employeeDetails.employeeId = currUser.userId;
            $scope.employeeDetails.employeeEmail = currUser.employeeEmail;
            $scope.employeeDetails.employeeName = $scope.viewName;
            $scope.employeeDetails.managerId = currUser.reportingManager.managerId;
            $scope.employeeDetails.managerName = currUser.reportingManager.managerName;
            $scope.employeeDetails.branchId = currUser.branchDetails.branchId;
            $scope.employeeDetails.branchName = currUser.branchDetails.branchName;
            $scope.employeeDetails.branchCity = currUser.branchDetails.branchCity;
            $scope.employeeDetails.companyId = currUser.companyDetails.companyId;
            $scope.employeeDetails.companyName = currUser.companyDetails.companyName;

            // console.log($scope.employeeDetails);
            employeeService
                .markTimeIn($scope.employeeDetails)
                .then(function (res) {
                    // console.log(res)
                    // $scope.clockedInData = res.data.clockInData;
                    console.log($scope.clockedInData);
                    var timeInfo = {
                        timeInTime: new Date().toLocaleTimeString(),
                        timeInId: res.data.clockInData._id
                    }
                    // $scope.timeInButton = false;
                    // $scope.timeOutButton = true;
                    // $scope.timeIn = $scope.clockedInData.timeIn;
                    // console.log(typeof ($scope.timeIn));
                    // console.log($scope.timeOut)
                    localStorage.setItem('timeIn', JSON.stringify(timeInfo));
                    // $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
            $scope.timeIn = JSON.parse(localStorage.getItem('timeIn')).timeInTime;
        }


        // PUNCHING OUT UPDATE
        $scope.TimeOut = function () {
            $scope.userTime = {
                timeId: JSON.parse(localStorage.getItem('timeIn')).timeInId,
                userId: currUser.userId
            }

            console.log($scope.userTime)

            employeeService
                .markTimeOut($scope.userTime)
                .then(function (res) {
                    console.log(res)
                    // console.log($scope.timeOut)
                    localStorage.setItem('timeIn', JSON.stringify(null));
                    // $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
    }
]);

