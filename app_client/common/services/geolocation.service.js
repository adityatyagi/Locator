(function() {



    angular
        .module('locatorApp')
        .service('geolocation', geolocation);

    function geolocation() {
        var getPosition = function(cbSuccess, cbError, cbNoGeo) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
            } else {
                cbNoGeo();
            }
        };

        return {
            getPosition: getPosition // returning getPosition function so that it can be invoked from the controller
        };
    }

})();