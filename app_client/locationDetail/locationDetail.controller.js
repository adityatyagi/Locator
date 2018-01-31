(function() {
    angular
        .module('locatorApp')
        .controller('locationDetailCtrl', locationDetailCtrl);

    locationDetailCtrl.$inject = ['$routeParams', '$uibModal', 'locatorData'];

    function locationDetailCtrl($routeParams, $uibModal, locatorData) {

        var vm = this;

        vm.locationid = $routeParams.locationid;

        locatorData.locationById(vm.locationid)
            .then(function success(response) {
                console.log(response);
                vm.data = { location: response.data }
                vm.pageHeader = { title: vm.data.location.name };
            }, function error(e) {
                console.log(e);
            });

        vm.popReviewForm = function() {
            alert('Lets add a review');
        }
    };

})();