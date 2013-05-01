"use strict";
/*!
 *  coinification - get notified about changes on the bitcoin market
 *
 *  @author Jascha Ehrenreich <jascha@jaeh.at>
 *  @created 26/04/2013 NZST
*/

var express = require('express'),// main js framework
    http = require('http'), // node http stack
    fs = require('fs'), // filesystem 
    load = require('express-load'), // enables load ("config").then ("models").into("app")
    cons = require('consolidate'), //consolidate is a template engine support middleware (x, waylandp)
    swig = require('swig'),// template engine
    stylus = require('stylus'),// css preprocessor
    path = require('path'), //enables multi os capable pathes (path.join('dir1', 'dir2') == dir1/dir2 [unix] or dir1\dir2 [win]
    async = require('async'), //async helper functions, see below (async.waterfall)
    mongoose = require('mongoose'),//db object relational mapper for mongo
    //passportconf = require(path.join(__dirname, 'lib', 'passportconf.js')),
    //cronJob = require(path.join(__dirname, 'lib', 'cron.js')), // cronjobs 
    //~ ircJob = require(path.join(__dirname, 'lib', 'irc.js')),
    configure = require(path.join(__dirname, 'lib', 'configure')),//loading configfiles
    app = module.exports = express(), // loading express libs
    server = http.createServer(app); //create the http server


//the functions below will exectue one after each other, 
//triggered by cb(), async has around 20 functions for async.paralell, async.waterfall, async*
async.waterfall([ 
    function (cb) {
        app.rootDir = __dirname;
        app.io = require('socket.io').listen(server);

        if (app.get('env') === 'production') {
            mongoose.connect('mongodb://localhost/procrastinate');//production db string, get this from your hoster.
        } else {
            mongoose.connect('mongodb://localhost/procrastinate');//Dev .... ^^
        }

        app.Schema = mongoose.Schema;
        
        // app settings 
        load('config') //load main app config
            .then('models') // then load db models
            .then ('controllers') //then load controllers
            .then('routes') //then load routes 
            .into(app); //load it all into app

        cb(null); //callback to trigger next function below
    },
    function (cb) {
        configure.do(app,cb);
    },
    function (cb) { //this function actually starts the server.
        server.listen(app.get('port'), function () {
            console.log("express server listening on port %d in %s mode", app.get('port'), app.get('env'));
            cb(null);
        });
    }
]);
