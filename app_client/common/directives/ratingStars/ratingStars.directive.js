(function() {



    angular
        .module('locatorApp')
        .directive('ratingStars', ratingStars);


    function ratingStars() {
        return {

            scope: {
                thisRating: '=rating'
            },
            templateUrl: '/common/directives/ratingStars/ratingStars.template.html'
        };
    }

})();