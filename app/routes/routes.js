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
        });;
}])
