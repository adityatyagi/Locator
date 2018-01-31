(function() {



    // regestering the service with the angular app
    angular
        .module('locatorApp')
        .service('locatorData', locatorData);


    locatorData.$inject = ['$http'];

    function locatorData($http) {

        // to fetch the details of all the cafes around a gicen location
        var locationByCoords = function(lat, lng) {
            return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=2000');
        };

        // to fetch the details of a particular location
        var locationById = function(locationid) {
            return $http.get('/api/locations/' + locationid);
        }

        return {
            locationByCoords: locationByCoords, // returning locationByCoords function making it accessible as method of service
            locationById: locationById
        };
    }

})();