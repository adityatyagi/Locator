(function() {



    angular
        .module('locatorApp')
        .directive('ratingStars', ratingStars);


    function ratingStars() {
        console.log('HI');
        return {

            scope: {
                thisRating: '=rating'
            },
            templateUrl: '/common/directives/ratingStars/ratingStars.template.html'
        };
    }

})();