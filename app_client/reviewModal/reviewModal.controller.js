(function() {
    angular
        .module('locatorApp')
        .controller('reviewModalCtrl', reviewModalCtrl);

    reviewModalCtrl.$inject = ['$uibModalInstance', 'locatorData', 'locationData'];

    function reviewModalCtrl($uibModalInstance, locatorData, locationData) {
        var vm = this;
        vm.locationData = locationData;


        vm.modal = {
            cancel: function() {
                $uibModalInstance.dismiss('cancel');
            }
        };

        vm.onSubmit = function() {
            // validating the form
            vm.formError = "";
            if (!vm.formData.rating || !vm.formData.reviewText) {
                vm.formError = "All fields required, please try again!";
                return false; // this will prevent the form from being submitted
            } else {
                vm.doAddReview(vm.locationData.locationid, vm.formData);

                // bringing the data in the formData from ng-model in the form which is built in the view
                //console.log(vm.formData);
                //return false;
            }
        };

        vm.doAddReview = function(locationid, formData) {
            console.log(formData);
            locatorData.addReviewById(locationid, {
                rating: formData.rating,
                reviewText: formData.reviewText
            }).then(function(response) {
                console.log(response);
                vm.modal.close(response);
            }, function(e) {
                console.log(e);
                vm.formError = "Your review has not been saved, try again!";
            });
            return false;
        };

        vm.modal = {
            close: function(result) {
                $uibModalInstance.close(result); //this will send a promise to the parent controller
            },
            cancel: function() {
                $uibModalInstance.dismiss('cancel');
            }
        };
    }
})();