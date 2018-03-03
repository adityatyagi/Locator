(function() {
    angular
        .module('locatorApp')
        .controller('locationDetailCtrl', locationDetailCtrl);

    locationDetailCtrl.$inject = ['$routeParams', '$location', '$uibModal', 'locatorData', 'authentication'];

    function locationDetailCtrl($routeParams, $location, $uibModal, locatorData, authentication) {

        var vm = this;

        vm.locationid = $routeParams.locationid;

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentPath = $location.path();

        locatorData.locationById(vm.locationid)
            .then(function success(response) {
                //console.log(response);
                vm.data = { location: response.data }
                vm.pageHeader = { title: vm.data.location.name };
            }, function error(e) {
                console.log(e);
            });

        //modal-defination    
        vm.popReviewForm = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/reviewModal/reviewModal.view.html',
                controller: 'reviewModalCtrl as vm',
                resolve: {
                    locationData: function() {
                        return {
                            locationid: vm.locationid,
                            locationName: vm.data.location.name
                        };
                    }
                }
            });

            modalInstance.result.then(function(response) {
                console.log('this is the response just before getting added: ' + response.data);
                vm.data.location.reviews.push(response.data); // add newly added review to the review array 
            }, function(e) {
                console.log(e);
            })
        };
    };

})();