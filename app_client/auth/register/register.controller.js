(function() {

    angular
        .module('locatorApp')
        .controller('registerCtrl', registerCtrl);

    registerCtrl.$inject = ['$location', 'authentication'];

    function registerCtrl($location, authentication) {

        var vm = this;

        vm.pageHeader = {
            title: 'Create new Locator Account!'
        };

        vm.credentials = {
            name: "",
            email: "",
            password: ""
        };

        vm.returnPage = $location.search().page || '/'

        vm.onSubmit = function() {
            vm.formError = "";

            if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
                vm.formError = "All fields are required, please try again.";
                return false;
            } else {
                vm.doRegister();
            }
        };

        vm.doRegister = function() {
            vm.formError = "";

            // using the service "authentication"
            authentication
                .register(vm.credentials)
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