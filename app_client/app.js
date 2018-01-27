// with this setter in place, we can add filters, directives and controllers to the main app
// module setter for our SPA application

(function() {
    //IIFE


    angular.module('locatorApp', ['ngRoute']);

    // config function will define different routes for the angular application
    function config($routeProvider) {
        $routeProvider
            .when('/', {
                //will hold route definations
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'

            })
            .otherwise({ redirectTo: '/' });
    }

    angular
        .module('locatorApp')
        .config(['$routeProvider', config]);

})();