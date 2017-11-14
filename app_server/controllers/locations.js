/* GET home page -> the page with locations list */
module.exports.homelist = function(req, res) {
    res.render("locations-list", { title: "Locator | List of nearby locations" });
};

/* GET Location-Info page */
module.exports.locationInfo = function(req, res) {
    res.render("location-info", { title: "Locator | Location Info" });
};

/* GET Add-Review Page */
module.exports.addReview = function(req, res) {
    res.render("location-review-form", { title: "Locator | Add Review" });
};