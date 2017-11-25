// creating a placeholder for the controller to check if the controller and the routes work or not.

// The api should be able to talk to the database and the api talks to the db through models
var mongoose = require('mongoose'); // gives controller access to the database connection
var Loc = mongoose.model('Location'); // brings in the location model so that we can interact with the Locations collection

module.exports.locationsListByDistance = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = parseFloat(req.query.maxDistance);

    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };

    var geoOptions = {
        spherical: true,
        //maxDistance: theEarth.getRadsFromDistance(maxDistance), // set maximum distance to 20 km
        maxDistance: maxDistance,
        num: 10 // maximum number of results shown on the homepage
    };

    if ((!lng && lng !== 0) || (!lat && lat !== 0) || !maxDistance) {
        sendJsonResponse(res, 404, { "message": "lng and lat parameters are required" });
        return;
    }

    Loc.geoNear(point, geoOptions, function(err, results, stats) {

        //console.log(point);
        //console.log(results);

        var locations = [];

        if (err) {
            sendJsonResponse(res, 404, err);
        } else {
            results.forEach(function(doc) {
                locations.push({
                    //distance: theEarth.getDistanceFromRads(doc.dis),
                    distance: doc.dis,
                    name: doc.obj.name,
                    address: doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id: doc.obj._id
                });
            });

            sendJsonResponse(res, 200, locations);
        }
    });
};

module.exports.locationsCreate = function(req, res) {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","), // creates a array by splitting a , seprated list
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1
        }, {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
        }]
    }, function(err, location) {
        if (err) {
            sendJsonResponse(res, 404, err);
        } else {
            sendJsonResponse(res, 200, location);
        }
    });
};

module.exports.locationsReadOne = function(req, res) {
    if (req.params && req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .exec(function(err, location) {
                if (!location) {
                    sendJsonResponse(res, 404, { "message": "location not found" });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, location);
            });
    } else {
        sendJsonResponse(res, 404, { "message": "No locationid in request" });
    }
};

module.exports.locationsUpdateOne = function(req, res) {
    if (!req.params.locationid) {
        sendJsonResponse(res, 404, { "message": "Not Found, Locationid is required" });
        return;
    }

    Loc
        .findById(req.params.locationid)
        .select('-reviews -rating') // excluding the reviews and overall rating becasue they are connected to each other and are updated seprately
        .exec(function(err, location) {
            if (!location) {
                sendJsonResponse(res, 404, { 'message': 'locationid not found' });
                return;
            } else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            }

            location.name = req.body.name;
            location.address = req.body.address;
            location.facilities = req.body.facilities.split(',');
            location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
            location.openingTimes = [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1
            }, {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2
            }];

            location.save(function(err, location) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, location); // this will send the updated location
                }
            });
        });
};

module.exports.locationsDeleteOne = function(req, res) {
    var locationid = req.params.locationid;
    if (locationid) {
        Loc
            .findByIdAndRemove(locationid)
            .exec(function(err, location) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                } else {
                    sendJsonResponse(res, 204, null);
                }
            });
    } else {
        sendJsonResponse(res, 404, { 'message': 'No locationid' });
    }
};


var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};