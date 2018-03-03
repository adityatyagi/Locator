// https://stackoverflow.com/questions/35677141/how-to-select-a-mongo-subdocument-by-id-with-mongoose

// creating a placeholder for the controller to check if the controller and the routes work or not.

// The api should be able to talk to the database and the api talks to the db through models
var mongoose = require('mongoose'); // gives controller access to the database connection
var Loc = mongoose.model('Location'); // brings in the location model so that we can interact with the Locations collection

// to use data from JWT to query the database
var User = mongoose.model('User');

var getAuthor = function(req, res, callback) {
    if (req.payload && req.payload.email) {
        User
            .findOne({ email: req.payload.email })
            .exec(function(err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, { "message": "User not found" });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJsonResponse(res, 404, err);
                    return;
                }
                callback(req, res, user.name);
            })
    } else {
        sendJsonResponse(res, 404, { "message": "User Not Found" });
        return;
    }
};


var doAddReview = function(req, res, location, author) {
    if (!location) {
        sendJsonResponse(res, 404, { "message": "Location Not Found" });
    } else {
        // create the body of the review object and push it into the location's "reviews" array found
        location.reviews.push({
            author: author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });

        // after adding to the "reviews" sub-document, we save the parent document
        location.save(function(err, location) {
            var thisReview;

            if (err) {
                console.log(err);
                sendJsonResponse(res, 400, err);
            } else {
                // adding a new review will bring a "rating" with it, therefore we have to update the overall rating of the location
                updateAverageRating(location._id);

                // creating the "content" for the response: which will be the newely added review
                thisReview = location.reviews[location.reviews.length - 1]; // taking the last review added
                sendJsonResponse(res, 201, thisReview);
            }
        });
    }
};




var updateAverageRating = function(locationid) {
    Loc
        .findById(locationid)
        .select('rating reviews')
        .exec(function(err, location) {
            if (!err) {
                doSetAverageRating(location);
            }
        });
};


var doSetAverageRating = function(location) {
    var i, reviewCount, ratingAverage, ratingTotal;

    if (location.reviews && location.reviews.length > 0) {
        reviewCount = location.reviews.length; // number of reviews = no. of ratings
        //console.log(reviewCount);
        ratingTotal = 0;
        for (i = 0; i < reviewCount; i++) {
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        //console.log(ratingTotal);
        //console.log(ratingTotal / reviewCount);

        // This will change 2.714285 to 2
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);


        // updating the path "rating" of the given location
        location.rating = ratingAverage;

        // saving the parent document
        location.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Average rating updated to " + ratingAverage);
            }
        });
    }
};


module.exports.reviewsCreate = function(req, res) {
    // validate that the user exists in the database and then return user's name to be used in the controller
    getAuthor(req, res, function(req, res, userName) {
        if (req.params.locationid) {
            Loc
                .findById(req.params.locationid)
                .select('reviews')
                .exec(function(err, location) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        doAddReview(req, res, location, userName); // pass user's name in doAddReview function
                    }
                });
        } else {
            sendJsonResponse(res, 404, { "message": "Review Not Found, Location required" });
        }
    });
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
    if (!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, { 'message': 'Not found, locationid and reviewid both are required.' });
        return;
    }

    Loc
        .findById(req.params.locationid) // find the "document"
        .select('reviews') // select only "reviews" path from the document
        .exec(function(err, location) {
            var thisReview;

            if (!location) {
                sendJsonResponse(res, 404, { 'message': 'locationid not found.' });
                return;
            } else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            }

            if (location.reviews && location.reviews.length > 0) {
                thisReview = location.reviews.id(req.params.reviewid); // finding the "sub-document"

                if (!thisReview) {
                    sendJsonResponse(res, 404, { 'message': 'reviewid not found' });
                } else {

                    // update the review paths
                    thisReview.author = req.body.author;
                    thisReview.rating = req.body.rating;
                    thisReview.reviewText = req.body.reviewText;

                    // save the "document" with the updated average rating value
                    location.save(function(err, location) {
                        if (err) {
                            sendJsonResponse(res, 404, err);
                        } else {
                            //update average rating of the location
                            updateAverageRating(location._id);
                            sendJsonResponse(res, 200, thisReview);
                        }
                    });
                }
            } else {
                sendJsonResponse(res, 404, { 'message': 'No review to update' });
            }

        });
};

module.exports.reviewsDeleteOne = function(req, res) {
    if (!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, { 'message': 'locationid and reviewid both are required' });
        return;
    }

    Loc
        .findById(req.params.locationid) // finding the main document
        .select('reviews')
        .exec(function(err, location) {
            if (!location) {
                sendJsonResponse(res, 404, { 'message': 'locationid not found' });
                return;
            } else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            }

            if (location.reviews && location.reviews.length > 0) {
                if (!location.reviews.id(req.params.reviewid)) {
                    sendJsonResponse(res, 404, { 'message': 'reviewid not found' });
                } else {
                    // deleting the sub-document
                    location.reviews.id(req.params.reviewid).remove();

                    // saving the main "document"
                    location.save(function(err, location) {
                        if (err) {
                            sendJsonResponse(res, 404, err);
                        } else {
                            // updating the average rating of the location in consideration
                            updateAverageRating(location._id);
                            sendJsonResponse(res, 204, null);
                        }
                    });
                }

            } else {
                sendJsonResponse(res, 404, { 'message': 'No review to delete' });
            }
        });
};

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};