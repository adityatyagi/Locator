(function() {



    // regestering the service with the angular app
    angular
        .module('locatorApp')
        .service('locatorData', locatorData);


    locatorData.$inject = ['$http', 'authentication'];

    function locatorData($http, authentication) {

        // to fetch the details of all the cafes around a gicen location
        var locationByCoords = function(lat, lng) {
            return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=2000');
        };

        // to fetch the details of a particular location
        var locationById = function(locationid) {
            return $http.get('/api/locations/' + locationid);
        };

        //to add review from the modal on the location-detail page
        var addReviewById = function(locationid, data) {
            return $http.post('/api/locations/' + locationid + '/reviews', data, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        return {
            locationByCoords: locationByCoords, // returning locationByCoords function making it accessible as method of service
            locationById: locationById,
            addReviewById: addReviewById
        };
    }

})();