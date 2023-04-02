///<reference path="../app.js" />
app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("login", {
            url: "/",
            templateUrl: "login.html",
            controller: "loginController"
        })
        .state("sidebar", {
            url: "/sidebar",
            templateUrl: "./views/superadmin/superadmin.sidebar.html",
            controller: "superAdminCtrl"
        })
        .state("sidebar.dashboard", {
            url: "/superadmin",
            templateUrl: "./views/superadmin/superadmin.dashboard.html",
            controller: "superAdminCtrl"
        })
        .state("sidebar.viewall", {
            url: "/view-all",
            templateUrl: "./views/superadmin/superadmin.view-all.html",
            controller: "superAdminCtrl"
        })
        .state("sidebar.previous-customers", {
            url: "/previous-customers",
            templateUrl: "./views/superadmin/superadmin.previous-customers.html",
            controller: "superAdminCtrl"
        })
        .state("sidebar.company", {
            url: "/company/:company_id",
            templateUrl: "./views/superadmin/superadmin.specific-company.html",
            controller: "companyDetailsCtrl"
        })
        .state("sidepanel", {
            url: "/sidepanel",
            templateUrl: "./views/company/company.sidepanel.html",
            controller: "companyAdminCtrl"
        })
        .state("sidepanel.dashboard", {
            url: "/company",
            templateUrl: "./views/company/company.dashboard.html",
            controller: "companyAdminCtrl"
        })
        .state("sidepanel.viewall", {
            url: "/view-all",
            templateUrl: "./views/company/company.view-all.html",
            controller: "companyAdminCtrl"
        })
        .state("sidepanel.branch", {
            url: "/branch/:branch_id",
            templateUrl: "./views/company/company.specific-branch.html",
            controller: "branchDetailsCtrl"
        })
        .state("sidepanel.employees", {
            url: '/employees',
            templateUrl: "./views/branch/branch.view-all.html",
            controller: "companyAdminCtrl"
        })
        .state("sidepanel.employee", {
            url: "/employee/:employee_id",
            templateUrl: "./views/branch/branch.specific-employee.html",
            controller: "employeeDetailsCtrl"
        })
        .state("sideboard", {
            url: "/sideboard",
            templateUrl: "./views/branch/branch.sideboard.html",
            controller: "branchAdminCtrl"
        })
        .state("sideboard.dashboard", {
            url: "/branch",
            templateUrl: "./views/branch/branch.dashboard.html",
            controller: "branchAdminCtrl"
        })
        .state("sideboard.viewall", {
            url: "/view-all",
            templateUrl: "./views/branch/branch.view-all.html",
            controller: "branchAdminCtrl"
        })
        .state("sideboard.viewall-deptheads", {
            url: "/department-heads",
            templateUrl: "./views/branch/branch.view-dept-heads.html",
            controller: "branchAdminCtrl"
        })
        .state("sideboard.viewall-pastemployees", {
            url: "/past-employees",
            templateUrl: "./views/branch/branch.view-past-employees.html",
            controller: "branchAdminCtrl"
        })
        .state("sideboard.employee", {
            url: "/employee/:employee_id",
            templateUrl: "./views/branch/branch.specific-employee.html",
            controller: "employeeDetailsCtrl"
        })
        .state("sideboard.analytics", {
            url: "/analytics",
            templateUrl: "./views/branch/branch.analytics.html",
            controller: "branchAdminCtrl"
        })
        .state("sidemenu", {
            url: "/sidemenu",
            templateUrl: "./views/hradmin/hradmin.sidemenu.html",
            controller: "hrAdminCtrl"
        })
        .state("sidemenu.dashboard", {
            url: "/hradmin",
            templateUrl: "./views/hradmin/hradmin.dashboard.html",
            controller: "hrAdminCtrl"
        })
        .state("sidemenu.viewall", {
            url: "/view-all",
            // templateUrl: "./views/hradmin/hradmin.view-all.html",
            templateUrl: "./views/branch/branch.view-all.html",
            controller: "hrAdminCtrl"
        })
        .state("sidemenu.viewall-deptheads", {
            url: "/department-heads",
            // templateUrl: "./views/hradmin/hradmin.view-dept-heads.html",
            templateUrl: "./views/branch/branch.view-dept-heads.html",
            controller: "hrAdminCtrl"
        })
        .state("sidemenu.viewall-pastemployees", {
            url: "/past-employees",
            // templateUrl: "./views/hradmin/hradmin.view-past-employees.html",
            templateUrl: "./views/branch/branch.view-past-employees.html",
            controller: "hrAdminCtrl"
        })
        .state("sidemenu.employee", {
            url: "/employee/:employee_id",
            templateUrl: "./views/branch/branch.specific-employee.html",
            controller: "employeeDetailsCtrl"
        })
        .state("sidemenu.attendance", {
            url: "/attendance",
            templateUrl: "./views/employee/employee.attendance.html",
            controller: "hrAdminCtrl"
        })
        .state("sidemenu.leave", {
            url: "/leave",
            templateUrl: "./views/hradmin/hradmin.leave.nav.html",
            controller: "hrAdminCtrl"
        })
        .state("sidemenu.leave.apply-leave", {
            url: "/apply-leave",
            templateUrl: "./views/employee/employee.apply-leave.html",
            controller: "hrAdminCtrl"
        })
        .state("sidemenu.leave.my-leaves", {
            url: "/my-leaves",
            templateUrl: "./views/employee/employee.my-leaves.html",
            controller: "hrAdminCtrl"
        })
        .state("sidemenu.leave.approve-leaves", {
            url: "/approve-leaves",
            templateUrl: "./views/employee/employee.approve-leaves.html",
            controller: "hrAdminCtrl"
        })
        .state("menu", {
            url: "/menu",
            templateUrl: "./views/employee/employee.menu.html",
            controller: "employeeCtrl"
        })
        .state("menu.attendance", {
            url: "/attendance",
            templateUrl: "./views/employee/employee.attendance.html",
            controller: "employeeCtrl"
        })
        .state("menu.leave", {
            url: "/leave",
            templateUrl: "./views/employee/employee.leave.nav.html",
            controller: "employeeCtrl"
        })
        .state("menu.leave.apply-leave", {
            url: "/apply-leave",
            templateUrl: "./views/employee/employee.apply-leave.html",
            controller: "employeeCtrl"
        })
        .state("menu.leave.my-leaves", {
            url: "/my-leaves",
            templateUrl: "./views/employee/employee.my-leaves.html",
            controller: "employeeCtrl"
        })
        .state("menu.leave.approve-leaves", {
            url: "/approve-leaves",
            templateUrl: "./views/employee/employee.approve-leaves.html",
            controller: "employeeCtrl"
        });
}])
