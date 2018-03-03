(function() {


    angular
        .module('locatorApp')
        .directive('navigation', navigation)

    function navigation() {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/navigation/navigation.template.html',
            controller: 'navigationCtrl as navvm' // using a controller with a directive
        };
    }
})();