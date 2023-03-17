///<reference path="../app.js" />

app.controller('hrAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    'hrService',
    function ($scope, $http, $window, hrService) {
        $scope.hradmin = {};
        $scope.departmentHeads = [];
        $scope.employees = [];
        $scope.pastEmployees = [];

        $scope.maritalStatuses = ["married", "single", "rda"];
        $scope.employeeRoles = ["departmenthead", "employee"];
        $scope.genders = ["male", "female", "other", "rda"];


        var currUser = JSON.parse(localStorage.getItem('user'));
        $scope.viewName = currUser.firstName + ' ' + currUser.lastName;
        // console.log($scope.viewname);

        // GETTING THE DEPARTMENTS FOR A BRANCH
        hrService
            .getBranchDepartments(currUser.branchDetails.branchId)
            .then(function(res) {
                $scope.branchDepts = res.data.departments;
                // console.log($scope.branchDepts.departments)
            })
            .catch(function(err) {
                console.log(err)
            })

        // VIEWING ALL ACTIVE EMPLOYEE INFO
        hrService
            .getAllEmployees(currUser.branchDetails.branchId)
            .then(function(res) {
                $scope.employees = res.data.branchData;
            })
            .catch(function(err) {
                console.log(err);
            });

        // VIEWING ALL DEPARTMENT HEADS
        hrService
            .getDepartmentHeads(currUser.branchDetails.branchId)
            .then(function(res) {
                $scope.departmentHeads = res.data.departmentHeads;
            })
            .catch(function(err) {
                console.log(err);
            });

        // VIEWING PAST EMPLOYEE INFOS
        hrService
            .getPastEmployees(currUser.branchDetails.branchId)
            .then(function (res) {
                $scope.pastEmployees = res.data.previousEmployeesData;
                // console.log($scope.pastEmployees);
            })
            .catch(function (err) {
                console.log(err);
            })
        
        // EDIT EMPLOYEE INFO MODAL
        $scope.openEditModal = function (employee) {
            // console.log(employee._id);
            hrService
                .getEmployeeInfo(employee._id)
                .then(function (res) {
                    $scope.employee = res.data.employeeData;
                    // console.log($scope.employee);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#editModal').modal('show');
        };

        $scope.saveData = function ($event) {
            $event.preventDefault();

            hrService
                .updateEmployeeInfo($scope.employee)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err);
                })
        };

        // REMOVE EMPLOYEE MODAL
        $scope.openDeleteModal = function (employee) {
            hrService
                .getEmployeeInfo(employee._id)
                .then(function (res) {
                    $scope.employee = res.data.employeeData;
                    // console.log($scope.company);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#deleteModal').modal('show');
        };

        $scope.deleteData = function ($event) {
            $event.preventDefault();

            hrService
                .removeEmployee($scope.employee._id)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };

        // CREATING A NEW EMPLOYEE MODAL
        $scope.openNewEmployeeModal = function () {
            $http.get('#newEmployeeModal').modal('show');
        };

        $scope.addNewEmployee = function ($event) {
            $event.preventDefault();
            $scope.employee.companyid = currUser.companyDetails.companyId;
            $scope.employee.companyname = currUser.companyDetails.companyName;
            $scope.employee.branchid = currUser.branchDetails.branchId;
            $scope.employee.branchname = currUser.branchDetails.branchName;
            $scope.employee.branchcity = currUser.branchDetails.branchCity;
            // console.log($scope.employee.department);
            console.log($scope.employee);

            hrService
                .createEmployee($scope.employee)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };
    }
]);