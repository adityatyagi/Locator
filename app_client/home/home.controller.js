(function() {


    angular
        .module('locatorApp')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', 'locatorData', 'geolocation']; //manually protecting dependencies to protect against minification
    // if this is not done, then the dependencies will become a,b,c, i.e letters which will break the code during minification 

    function homeCtrl($scope, locatorData, geolocation) {

        if (window.location.pathname !== '/') {
            window.location.href = '/#' + window.location.pathname;
        }

        var vm = this;

        // this will go in the pageHeader directive in the view
        vm.pageHeader = {
            title: 'Locator',
            strapline: 'Find places to work with wifi near you!'
        };

        vm.sidebar = {
            content: "Looking for wifi and a seat to work?"
        };

        // Setting the messages for the user as the website loads the data asynchronously
        vm.message = "Checking your location";

        vm.getData = function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            vm.message = "Searching for nearby places";

            // a promise is being sent by the locatorData service
            locatorData.locationByCoords(lat, lng)
                .then(function success(response) {
                    vm.message = response.data.length > 0 ? "" : "No Locations Found";
                    vm.data = { locations: response.data };
                }, function error(e) {
                    vm.message = "Sorry, something's gone wrong!";
                    console.log(e);
                });
        };

        // if geolocation is supported but not sucessfull: unable to fetch the location
        vm.showError = function(error) {
            $scope.$apply(function() {
                vm.message = error.message;
            });
        };

        // if geolocation isn't supported by the browser
        vm.NoGeo = function() {
            $scope.$apply(function() {
                vm.message = "Geolocation is not supported by the browser.";
            });
        };

        geolocation.getPosition(vm.getData, vm.showError, vm.NoGeo);

    }

})();