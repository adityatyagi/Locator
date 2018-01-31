(function() {
    angular
        .module('locatorApp')
        .controller('aboutCtrl', aboutCtrl);

    function aboutCtrl() {
        // using vm variable to hold the view-model data
        var vm = this;

        vm.pageHeader = {
            title: 'About Locator',
        };

        vm.main = {
            content: 'Locator is created to help people find places to sit down and get a bit of work done.\n\nThis is one of the best places to work!'
        };
    }
})();