// the angular module setter for the application
angular.module('locatorApp', []);

// controller
// we are using $http service 
var locationListCtrl = function($scope, locatorData, geolocation) {

    // Setting the messages for the user as the website loads the data asynchronously
    $scope.message = "Checking your location";

    $scope.getData = function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        $scope.message = "Searching for nearby places";

        // a promise is being sent by the locatorData service
        locatorData.locationByCoords(lat, lng)
            .then(function success(response) {
                $scope.message = response.data.length > 0 ? "" : "No Locations Found";
                $scope.data = { locations: response.data };
            }, function error(e) {
                $scope.message = "Sorry, something's gone wrong!";
                console.log(e);
            });
    };

    // if geolocation is supported but not sucessfull: unable to fetch the location
    $scope.showError = function(error) {
        $scope.$apply(function() {
            $scope.message = error.message;
        });
    };

    // if geolocation isn't supported by the browser
    $scope.NoGeo = function() {
        $scope.$apply(function() {
            $scope.message = "Geolocation is not supported by the browser.";
        });
    };

    geolocation.getPosition($scope.getData, $scope.showError, $scope.NoGeo);

};

// create a custom filter to apply formatting to distances
var isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var formatDistance = function() {
    return function(distance) {
        var numDistance, unit;
        if (distance > 1) {
            numDistance = parseFloat(distance / 1000).toFixed(1);
            unit = 'km'
        } else {
            numDistance = parseInt(distance, 10);
            unit = 'm';
        }
        return numDistance + unit;
    }
}


// directives for formatting the stars : creating HTML snippets
// the name of the function is in camelCase and its important that way
var ratingStars = function() {
    return {
        // isolate scope
        scope: {
            thisRating: '=rating'
        },

        templateUrl: "/angular/rating-stars.html"
    };
};

// thisRating is the scope variable and the value of '=rating' tells angular to look for an attribute called
// rating on the same HTML element that defined the directive.



// creating the service which will be called by the controller
// the controller doesnt care how it recieves the data, it is just concerned with who to ask for it
var locatorData = function($http) {
    var locationByCoords = function(lat, lng) {
        return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=2000');
    };

    return {
        locationByCoords: locationByCoords // returning locationByCoords function making it accessible as method of service
    }

};


// geolocation service
var geolocation = function() {
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
};




// attaching the controller to the angular application - getter syntax
angular
    .module('locatorApp')
    .controller('locationListCtrl', locationListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)
    .service('locatorData', locatorData)
    .service('geolocation', geolocation);