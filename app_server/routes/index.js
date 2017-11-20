var express = require('express');
var router = express.Router();
//var mainController = require('../controllers/main');
var ctrlLocations = require("../controllers/locations");
var ctrlOthers = require("../controllers/others");

/* GET home page. */
//router.get('/', mainController.index);

/* Locations Pages */
router.get("/", ctrlLocations.homelist);
router.get("/location/:locationid", ctrlLocations.locationInfo);
router.get("/location/:locationid/reviews/new", ctrlLocations.addReview);
router.post("/location/:locationid/reviews/new", ctrlLocations.doAddReview);

/* Others Pages */
router.get("/about", ctrlOthers.about);

module.exports = router;