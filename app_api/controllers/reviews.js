// https://stackoverflow.com/questions/35677141/how-to-select-a-mongo-subdocument-by-id-with-mongoose

// creating a placeholder for the controller to check if the controller and the routes work or not.

// The api should be able to talk to the database and the api talks to the db through models
var mongoose = require('mongoose'); // gives controller access to the database connection
var Loc = mongoose.model('Location'); // brings in the location model so that we can interact with the Locations collection



module.exports.reviewsCreate = function(req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};

module.exports.reviewsReadOne = function(req, res) {
    if (req.params && req.params.locationid && req.params.reviewid) {
        Loc
            .findById(req.params.locationid)
            .select('name reviews')
            .exec(function(err, location) {
                var response, review;
                if (!location) {
                    sendJsonResponse(res, 404, { "message": "location not found" });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }

                if (location.reviews && location.reviews.length > 0) {
                    review = location.reviews.id(req.params.reviewid);
                    if (!review) {
                        sendJsonResponse(res, 404, { "message": "review not found" });
                    } else {
                        response = {
                            location: {
                                name: location.name,
                                id: req.params.locationid
                            },
                            review: review
                        };

                        sendJsonResponse(res, 200, response);
                    }
                } else {
                    sendJsonResponse(res, 404, { "message": "No reviews found." })
                }
            })

    } else {
        sendJsonResponse(res, 404, { "message": "reviewid or locationid not found in the url" })
    }
};

module.exports.reviewsUpdateOne = function(req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};

module.exports.reviewsDeleteOne = function(req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};