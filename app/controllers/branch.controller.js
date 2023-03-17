///<reference path="../app.js" />

app.controller('branchAdminCtrl', [
    '$scope',
    '$http',
    '$window',
    'branchService',
    function ($scope, $http, $window, branchService) {
        $scope.branch = {};
        $scope.genders = ["male", "female", "other", "rda"];
        $scope.maritalStatuses = ["married", "single", "rda"];
        $scope.employeeRoles = ["departmenthead", "hradmin", "employee"];
        $scope.employees = [];
        $scope.departmentHeads = [];
        $scope.pastEmployees = [];
        var currBranch = JSON.parse(localStorage.getItem('user'));

        // VIEWING BRANCH DETAILS
        branchService
            .getBranchInfo(currBranch.branchDetails.branchId)
            .then(function (res) {
                $scope.branch = res.data.branchData;
                // console.log($scope.branch);
            })
            .catch(function (err) {
                console.log(err);
            });

        // VIEWING ALL EMPLOYEE INFO
        branchService
            .getAllEmployees(currBranch.branchDetails.branchId)
            .then(function (res) {
                $scope.employees = res.data.branchData;
                // console.log($scope.employees);
            })
            .catch(function (err) {
                console.log(err);
            });

        // VIEWING DEPARTMENT HEADS INFO
        branchService
            .getAllDepartmentHeads(currBranch.branchDetails.branchId)
            .then(function (res) {
                $scope.departmentHeads = res.data.departmentHeads;
                // console.log($scope.departmentHeads);
            })
            .catch(function (err) {
                console.log(err)
            });

        // VIEWING PAST EMPLOYEE INFOS
        branchService
            .getPastEmployees(currBranch.branchDetails.branchId)
            .then(function (res) {
                $scope.pastEmployees = res.data.previousEmployeesData;
                // console.log($scope.pastEmployees);
            })
            .catch(function (err) {
                console.log(err);
            })

        // CREATING A NEW EMPLOYEE MODAL
        $scope.openNewEmployeeModal = function () {
            $http.get('#newEmployeeModal').modal('show');
        };

        $scope.addNewEmployee = function ($event) {
            $event.preventDefault();
            $scope.employee.companyid = currBranch.companyDetails.companyId;
            $scope.employee.companyname = currBranch.companyDetails.companyName;
            $scope.employee.branchid = currBranch.branchDetails.branchId;
            $scope.employee.branchname = currBranch.branchDetails.branchName;
            $scope.employee.branchcity = currBranch.branchDetails.branchCity;
            // console.log($scope.employee.department);
            console.log($scope.employee);

            branchService
                .createEmployee($scope.employee)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };

        // UPDATING BRANCH ADMIN INFO MODAL
        $scope.openUpdateBranchAdminModal = function () {

            branchService
                .getBranchAdmin(currBranch.branchDetails.branchId)
                .then(function (res) {
                    $scope.branchadmin = res.data.adminData;
                    $scope.branchadmin.password = ''
                    // console.log($scope.superadmin);
                })
                .catch(function (err) {
                    console.log(err);
                })
            $http.get('#updateBranchAdminModal').modal('show');
        };

        $scope.updateBranchAdmin = function ($event) {
            $event.preventDefault();
            $scope.branchadmin.branchid = currBranch.branchDetails.branchId;
            $scope.branchadmin.companyid = currBranch.companyDetails.companyId;
            console.log($scope.branchadmin);
            branchService
                .updateBranchAdmin($scope.branchadmin)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };

        // EDIT EMPLOYEE INFO MODAL
        $scope.openEditModal = function (employee) {
            // console.log(employee._id);
            branchService
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

            branchService
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
            branchService
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

            branchService
                .removeEmployee($scope.employee._id)
                .then(function (res) {
                    // console.log(res.data);
                    $window.location.reload();
                })
                .catch(function (err) {
                    console.log(err)
                })
        };
    }
])