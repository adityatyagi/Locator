require('constants').SIGTERM;
require('constants').SIGUSR2;
require('path').win32;

// exposing the locations model to the application through db.js
require('./locations');

var mongoose = require('mongoose');

// Locator is the name of the database with which we will work
var dbURI = 'mongodb://localhost:27017/Locator';
if (process.env.NODE_ENV === 'production') {
    dbURI = 'mongodb://adityaDev:adityadev@ds113046.mlab.com:13046/locator';
}

// using named connection, this is used when we are working with multiple dbs
// var locatorDB = mongoose.createConnection(dbURI);

mongoose.connect(dbURI);

// to emit the SIGINT event in windows so that the node application can hear the disconnection event
var readLine = require('readline');

if (process.platform === "win32") {
    var rl = readLine.createInterface({
        input: process.stdin,
        outout: process.stdout
    });

    rl.on("SIGINT", function() {
        process.emit("SIGINT");
    });
}



// Mongoose will publish the events based on the status of the connection
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});


// Closing the database is a asynchronous activity
var gracefullShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

// When using nodemon to run the application, nodemon listens to SIGUSR2 event
// For nodemon restarts
// https://forums.manning.com/posts/list/34823.page
// https://github.com/remy/nodemon/issues/140
// this will not work.
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// event handler for the event SIGINT event emitted
process.on('SIGINT', function() {
    gracefullShutdown('app termination with Ctrl+C', function() {
        process.exit(0);
    });
});

// app shutdown in HEROKU
process.on('SIGTERM', function() {
    console.log('Heroku app shoutdown', function() {
        process.exit(0);
    });
});