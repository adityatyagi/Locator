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

            modalInstance.result.then(function success(response) {
                vm.data.location.reviews.push(response); // add newly added review to the review array 
            }, function error(e) {
                console.log(e);
            })
        };
    };

})();