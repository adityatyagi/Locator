(function() {

    angular
        .module('locatorApp')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$location', 'authentication'];

    function loginCtrl($location, authentication) {

        var vm = this;

        vm.pageHeader = {
            title: 'Sign in to Locator'
        };

        vm.credentials = {
            email: "",
            password: ""
        };

        vm.returnPage = $location.search().page || '/'

        vm.onSubmit = function() {
            vm.formError = "";

            if (!vm.credentials.email || !vm.credentials.password) {
                vm.formError = "All fields are required, please try again.";
                return false;
            } else {
                vm.doLogin();
            }
        };

        vm.doLogin = function() {
            vm.formError = "";

            // using the service "authentication"
            authentication
                .login(vm.credentials)
                .then(function(data) {
                    // if registration was successful, clear query string and redirect the user
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                }, function(err) {
                    vm.formError = err;
                });
        }
    };

})();