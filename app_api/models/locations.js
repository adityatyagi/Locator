// models will be exported to db.js so that from there, they can be exposed to app.js (application)
// this will have the schema for the locations data
// every instance of schema is then called model

var mongoose = require("mongoose");

// Subdocuments: all the nested-schemas must be defined before they are used

var openingTimeSchema = new mongoose.Schema({
    days: { type: String, required: true },
    opening: String,
    closing: String,
    closed: { type: Boolean, required: true }
});

var reviewSchema = new mongoose.Schema({
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewText: { type: String, required: true },
    createdOn: { type: Date, "default": Date.now }
});




// defining the schema for location data
// 2dsphere: It allows mongodb to calcualte geometries based on spherical object.
// location data will be stored in GeoJSON format: {longitude, latitude}
var locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    rating: { type: Number, "default": 0, min: 0, max: 5 },
    facilities: [String],
    coords: { type: [Number], index: '2dsphere', required: true },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});

// compiling the schema to a model
mongoose.model('Location', locationSchema);