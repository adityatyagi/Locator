(function() {
    angular
        .module('locatorApp')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['$location', 'authentication'];

    function navigationCtrl($location, authentication) {
        var vm = this;

        // exposing the current path
        vm.currentPath = $location.path();

        // find whether the current user is logged in or not
        vm.isLoggedIn = authentication.isLoggedIn();

        // to get the current user name
        vm.currentUser = authentication.currentUser();

        vm.logout = function() {
            authentication.logout();

            // redirect to homepage when the logout is complete
            $location.path('/');
        }
    };
})();