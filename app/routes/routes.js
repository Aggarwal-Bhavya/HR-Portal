///<reference path="../app.js" />
app.config(["$stateProvider","$urlRouterProvider",function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("login", {
            url: "/",
            templateUrl: "login.html",
            controller: "loginController"
        })
        .state("superadmin", {
            url: "/superadmin",
            templateUrl: "./views/superadmin/superadmin.dashboard.html",
            controller: "superAdminCtrl"
        })
        .state("company", {
            url: "/company",
            templateUrl: "./views/company/company.dashboard.html",
            controller: "companyAdminCtrl"
        });
}])
