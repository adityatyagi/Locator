(function() {
    angular
        .module('locatorApp')
        .service('authentication', authentication);

    authentication.$inject = ['$window', '$http', '$q']; // inject $window service

    function authentication($window, $http, $q) {
        // save token in the local-storage of user's browser
        var saveToken = function(token) {
            $window.localStorage['locator-token'] = token;
        };

        // get token from the local-storage
        var getToken = function() {
            return $window.localStorage['locator-token'];
        };

        var register = function(user) {
            return $http.post('/api/register', user).then(function(response) {
                saveToken(response.data.token);
            }, function(err) {
                console.log(err);
            });
        };

        var login = function(user) {
            return $http.post('/api/login', user).then(function(response) {
                saveToken(response.data.token);
            }, function(err) {
                console.log(err);
            });
        };

        var logout = function() {
            $window.localStorage.removeItem('locator-token');
            $window.location.reload();
        }

        var isLoggedIn = function() {
            var token = getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return {
                    email: payload.email,
                    name: payload.name
                };
            }
        };

        // expose methods (getToken and saveToken) to the application
        return {
            saveToken: saveToken,
            getToken: getToken,
            register: register,
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser
        };
    }
})();