/* GET home page -> the page with locations list */
module.exports.homelist = function(req, res) {
    res.render("locations-list", {
        title: "Locator | List of nearby locations",
        pageHeader: {
            title: "Locator",
            strapline: "Find places to work with wifi near you!"
        },
        sidebar: "Looking for wifi and a seat? Locator helps you find places to work",
        locations: [{
            name: "Starbucks",
            address: "WZ-59 A Moti Nagar, New Delhi 110015",
            rating: 3,
            facilities: ['Hot Drinks', 'Food', 'Premium Wifi'],
            distance: '100m'
        }, {
            name: "Cafe Coffee Day",
            address: "45/225 Shubash Nagar, New Delhi 110052",
            rating: 2,
            facilities: ['Indoor seating', 'Complimentry Drinks', 'Free Wifi'],
            distance: '500m'
        }]
    });
};

/* GET Location-Info page */
module.exports.locationInfo = function(req, res) {
    res.render("location-info", {
        title: "Starbucks",
        pageHeader: { title: "Starbucks" },
        sidebar: {
            context: "is on Locator because it has best food and accessiblity to wifi.",
            callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
        },
        location: {
            name: "Starbucks",
            address: "WZ-59 A Moti Nagar, New Delhi 110015",
            rating: 3,
            facilities: ['Hot Drinks', 'Food', 'Premium Wifi'],
            coords: { lat: 28.632178, lng: 77.217761 },
            openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            }, {
                days: 'Sunday',
                closed: true
            }],
            reviews: [{
                author: 'Aditya Tyagi',
                rating: 3,
                timestamp: '14 November, 2017',
                reviewText: "What a great place. I can't say enough good things about it."
            }, {
                author: 'Parv Jain',
                rating: 2,
                timestamp: '10 November, 2017',
                reviewText: "The best food in town."
            }]
        }
    });
};

/* GET Add-Review Page */
module.exports.addReview = function(req, res) {
    res.render("location-review-form", {
        title: "Review Starbucks on Locator",
        pageHeader: { title: "Review Starbucks" }
    });
};