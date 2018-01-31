//import { request } from 'https';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./app_api/models/db');

//for uglifyJS - minimizing the files
var uglifyJs = require('uglify-js');
var fs = require('fs');


// routes for the server application (express application routes) - MEN App
var routes = require('./app_server/routes/index');

// routes for the API-routes - MEN with Angular Components App
var routesApi = require('./app_api/routes/index');

var users = require('./app_server/routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// selecting all the files to be minified, minifying the files using uglify and then saving the file in memory
var appClientFiles = [
    'app_client/app.js',
    'app_client/home/home.controller.js',
    'app_client/common/services/locatorData.service.js',
    'app_client/common/services/geolocation.service.js',
    'app_client/common/filters/formatDistance.filter.js',
    'app_client/common/directives/ratingStars/ratingStars.directive.js'
];

var uglified = uglifyJs.minify(appClientFiles, { compress: false });

fs.writeFile('public/angular/locator.min.js', uglified.code, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Script generated and saved: locator.min.js');
    }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//for moving the application logic to the browser from the server, we need to send the entire folder as it is
// this is for making the application SPA
app.use(express.static(path.join(__dirname, 'app_client')));



// Telling the application when to use which routes, to use server application routes or api routes
// for the incoming requests.
//app.use('/', routes);


app.use('/api', routesApi);
app.use(function(req, res) {
    //res.sendFile(path.join(__dirname, 'app_client', index.html));
    res.sendFile(__dirname + '/app_client/index.html');
});



app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;