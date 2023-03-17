///<reference path="../app.js" />

app.controller('employeeCtrl', [
    '$scope',
    '$http',
    '$window',
    'employeeService',
    function ($scope, $http, $window, employeeService) {
        var currUser = JSON.parse(localStorage.getItem('user'));
        $scope.viewName = currUser.firstName + ' ' + currUser.lastName;

        // var currTime = JSON.parse(localStorage.getItem('timeIn'));

        // $scope.timeIn = localStorage.getItem('timeIn');
        $scope.timeIn = JSON.parse(localStorage.getItem('timeIn'));
        $scope.timeOut = localStorage.getItem('timeOut');

        $scope.employeeDetails = {};
        $scope.data = null;

        // console.log($scope.timeIn);
        // console.log($scope.timeOut);

        // marking the attendance
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
                .then(function(res) {
                    console.log(res.data.clockInData._id);
                    console.log(res.data.clockInData.timeIn);
                    // $scope.timeDetails = res.data.clockInData;
                    // console.log($scope.timeDetails);
                    var timeInfo = {
                        timeIn: res.data.clockInData.timeIn,
                        timeId: res.data.clockInData._id
                    }
                    $scope.data = res.data.clockInData;
                    localStorage.setItem('timeIn', JSON.stringify(timeInfo));
                    localStorage.removeItem('timeOut')
                })
                .catch(function(err) {
                    console.log(err)
                })
        }

        $scope.TimeOut = function() {
            // console.log(JSON.parse(localStorage.getItem('timeIn')));
            $scope.userTime = {
                timeId: JSON.parse(localStorage.getItem('timeIn')).timeId,
                userId: currUser.userId
            }

            employeeService
                .markTimeOut($scope.userTime)
                .then(function(res) {
                    console.log(res);
                    console.log(res.data.attendanceData);
                    localStorage.setItem('timeOut', 'timedOut');
                    localStorage.removeItem('timeIn');
                })
                .catch(function(err) {
                    console.log(err)
                })
        }
    }
]);