// this is in controller and the controller is responsible to interact with the model(data + database).
// this will have the application logic
// the requests coming from the browser will be routed here by the routes.

// this is for the index page of the website

module.exports.index = function(req, res, next) {
    res.render('index', { title: 'This data is from controller.' });
}