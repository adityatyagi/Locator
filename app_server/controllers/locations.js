/*
For the distances: https://forums.manning.com/posts/list/37802.page
https://docs.mongodb.com/manual/reference/command/geoNear/
*/

var request = require('request');

// the Base URL for the requests made to the API will be different for the live and the development environment
var apiOptions = {
    server: "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://cafefinder.herokuapp.com";
}

// function to fetch the location info which will be used in different controllers and the data will
// be played with according to the callback function combined with it
var getLocationInfo = function(req, res, callback) {
    var requestOptions, path;
    path = "/api/locations/" + req.params.locationid;

    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };

    request(requestOptions, function(err, response, body) {
        var data = body;
        if (response.statusCode === 200) {
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            callback(req, res, data);
        } else {
            _showError(req, res, response.statusCode);
        }
    });
};



var renderHomepage = function(req, res, responseBody) {
    var message;
    // if response isn't and array, set the message and set reponseBody to an empty array
    if (!(responseBody instanceof Array)) {
        message = "API Lookup Error";
        responseBody = [];
    } else {
        if (!responseBody.length) { // the responseBody is an array but it is empty
            message = 'No places found nearby';
        }
    }

    res.render("locations-list", {
        title: "Locator | List of nearby locations",
        pageHeader: {
            title: "Locator",
            strapline: "Find places to work with wifi near you!"
        },
        sidebar: "Looking for wifi and a seat? Locator helps you find places to work",
        locations: responseBody,
        message: message
    });
}



/* GET home page -> the page with locations list */
module.exports.homelist = function(req, res) {
    // rendering should be done after the data has been fetched from the database
    var requestOptions, path;
    path = '/api/locations';

    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {},
        qs: {
            lng: 77.217867,
            lat: 28.633919,
            //lng: 0,
            //lat: 0,
            maxDistance: 2000
        }
    };

    // creating the request for the api
    request(requestOptions, function(err, response, body) {
        // modiying the distance - altering the response got from the API
        var i, data;
        data = body;

        // validate that the API has returned some data before altering it
        if (response.statusCode === 200 && data.length) {
            for (i = 0; i < data.length; i++) {
                data[i].distance = _formatDistance(data[i].distance);
            }
        }
        renderHomepage(req, res, body);
    });

    var _formatDistance = function(distance) {
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
};

// ----------------------------------------------------//

var _showError = function(req, res, status) {
    // we'll use the generic-template
    var title, content;
    if (status === 404) {
        title = '404, page not found';
        content = 'Oh, we are sorry but we cannot find this page.';
    } else {
        title = status + ", something's gone wrong!";
        content = "Something, somewhere has gone just a little bit wrong.";
    }

    res.status(status);
    res.render('generic-text', {
        title: title,
        content: content
    });
};

var renderDetailPage = function(req, res, locDetail) {
    res.render("location-info", {
        title: locDetail.name,
        pageHeader: { title: locDetail.name },
        sidebar: {
            context: "is on Locator because it has best food and accessiblity to wifi.",
            callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
        },
        location: locDetail
    });
};

// -----------------------------------------------------//
/* GET Location-Info page */
// this is meant for data processing and API call
module.exports.locationInfo = function(req, res) {
    getLocationInfo(req, res, function(req, res, responseData) {
        renderDetailPage(req, res, responseData);
    });
};

// -------------------------------------------//

var renderReviewForm = function(req, res, locDetail) {
    res.render("location-review-form", {
        title: "Review " + locDetail.name + "on Locator",
        pageHeader: { title: "Review " + locDetail.name },
        error: req.query.err
    });
}


/* GET Add-Review Page */
module.exports.addReview = function(req, res) {
    getLocationInfo(req, res, function(req, res, responseData) {
        renderReviewForm(req, res, responseData);
    });
};

//--------------------------------------------//

/* POST doAddReview */
module.exports.doAddReview = function(req, res) {
    var requestOptions, path, locationid, postdata;
    locationid = req.params.locationid;

    // this is the API path for the controller ctrlReviews.reviewsCreate
    path = "/api/locations/" + locationid + '/reviews';

    postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };

    requestOptions = {
        url: apiOptions.server + path,
        method: 'POST',
        json: postdata
    };

    if (!postdata.author || !postdata.rating || !postdata.reviewText) {
        res.redirect('/location/' + locationid + '/reviews/new?err=val');
    } else {
        request(requestOptions, function(err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/location/' + locationid); // on successfull form submission, redirect to the location info page
            } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError') {
                res.redirect('/location/' + locationid + '/reviews/new?err=val');
            } else {
                console.log(body);
                _showError(req, res, response.statusCode);
            }
        });
    }
};