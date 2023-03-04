
///<reference path="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.js" />

///<reference path="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-route.min.js" />
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.4.2/angular-ui-router.min.js" />

var app = angular.module("myApp", ["ui.router"]);

app.controller('loginController', [
    '$scope',
    '$http',
    '$location',
    function ($scope, $http, $location) {
        $scope.loginUser = function () {
            console.log('allow login');
            $location.path('/superadmin');
            // console.log($scope.user);
            // $http
            // .post('http://localhost:5000/api/login/check-superadmin-info', $scope.user)
            // .then(function(res) {
            //     console.log(res.data);
            // })
            // .catch(function(err) {
            //     console.log(err);
            // })
        }
    }
])