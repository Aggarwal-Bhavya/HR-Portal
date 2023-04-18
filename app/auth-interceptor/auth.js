///<reference path="../app.js" />

app.factory('authInterceptor', [
    '$location',
    '$q',
    function($location, $q) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = localStorage.getItem("Authorization");
                if(token) {
                    config.headers.Authorization = token;
                }
                return config;
            },

            responseError: function (response) {
                if (response.status === 401) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        }
    }
]);