(function() {



    // regestering the service with the angular app
    angular
        .module('locatorApp')
        .service('locatorData', locatorData);


    locatorData.$inject = ['$http'];

    function locatorData($http) {
        var locationByCoords = function(lat, lng) {
            return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=2000');
        };

        return {
            locationByCoords: locationByCoords // returning locationByCoords function making it accessible as method of service
        };
    }

})();