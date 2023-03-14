///<reference path="../app.js" />
app.config(["$stateProvider","$urlRouterProvider",function ($stateProvider, $urlRouterProvider) {
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
        // .state("dashboard", {
        //     url: "/dashboard",
        //     templateUrl: "./views/superadmin/superadmin.dashboard.html",
        //     controller: "superAdminCtrl"
        // })
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
        .state("sidepanel.viewall-branchheads", {
            url: "/branch-heads",
            templateUrl: "./views/company/company.view-branch-heads.html",
            controller: "companyAdminCtrl"
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
        });
}])
