// with this setter in place, we can add filters, directives and controllers to the main app
// module setter for our SPA application

(function() {
    //IIFE


    angular.module('locatorApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

    // config function will define different routes for the angular application
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: '/common/views/genericText.view.html',
                controller: 'aboutCtrl',
                controllerAs: 'vm'
            })
            .when('/location/:locationid', {
                templateUrl: '/locationDetail/locationDetail.view.html',
                controller: 'locationDetailCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: '/auth/register/register.view.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: '/auth/login/login.view.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            //requireBase: false
        });
    }

    angular
        .module('locatorApp')
        .config(['$routeProvider', '$locationProvider', config]);

})();