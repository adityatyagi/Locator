var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');

// middleware for the authentication which is between the routes and the controller
var auth = jwt({
    secret: process.env.JWT_SECRET,

    //define property on req to be payload
    userProperty: 'payload'
});

var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');
var ctrlAuth = require('../controllers/authentication');

// API for login and registration
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// API routes for the locations
router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);

// API routes for the reviews
router.post('/locations/:locationid/reviews', auth, ctrlReviews.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid', auth, ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid', auth, ctrlReviews.reviewsDeleteOne);

module.exports = router;