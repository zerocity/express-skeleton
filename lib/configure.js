"use strict";

//############## LOADING depending libs


var fs = require('fs'),
    express = require('express'),
    load = require('express-load'),
    cons = require('consolidate'),
    swig = require('swig'),
    stylus = require('stylus'),
    passport = require('passport'),
    path = require('path'),
    slash = require('express-slash'),// add trailing + / to url if missing 
    utils = require(path.join(__dirname, 'utils'));


//############## 

exports.do = function (app, cb) {//
    var config = app.config[app.get('env')],
        confKey;

    for (confKey in config) {
        if (config.hasOwnProperty(confKey)) {
            // retrieve config values and set them to their values.
            // can later be loaded using app.get(confKey);
            app.set(confKey, config[confKey]);
        }
    }

    // ############# MIDDELWARE ########  Configuration
    app.configure(function () {
        
        var viewPath = path.join(app.rootDir, 'views'), //the views root
            staticPathIdx;

        app.set('views', viewPath); // directory with the view files

        app.use(express.compress());

        // ######## SWIG MIDDLEWARE SETTINGS,
        // NOTE: Swig requires some extra setup
        // This helps it know where to look for includes and parent templates
        swig.init({
            root        : viewPath,
            allowErrors : true, // allows errors to be thrown and caught by express instead of suppressed by Swig
            filters: require(path.join(__dirname, 'swigfilters'))
        });

        // loading SWIG Template engine 
        app.engine('.html', cons.swig);
        
        // tell express that html files are to be served as html files. can also be .ejs, .jade,swig
        app.set('view engine', 'html');
        
        // logs errors and debug info to the terminal 
        app.use(express.logger('dev'));

        //######## STYLUS MIDDLEWARE SETTINGS, those are CUSTOM! load from github.com/manarius/stylus!
        app.use(stylus.middleware({
            replaceInStylusPath: {rm: '/css', add: ''},
            src: viewPath,
            dest: app.rootDir + '/public',
            compile: function (str, p) {
                return stylus(str)
                    .set('filename', p)
                    .set('compress', true);
                //.use(nib());
            }
        }));


        //######## STATIC FILES SETTINGS 
        // load public dir 
        app.use(express.static(path.join(app.rootDir, 'public')));

        //reads http post data and puts them into req.body //simular in django to request.methods.get ... or post
        //<input name="username" id="username"/> turns into req.body.username
        app.use(express.bodyParser());
        
        //override standard express functions if needed [mainly loaded to be sure that node_modules always work]
        app.use(express.methodOverride());
        // loads favicon
        app.use(express.favicon(path.join(app.rootDir, 'public', 'img', 'favicon.ico')));
        
        
        //######## THEME MIDDLEWARE / CONFIG
        app.use(function (req,res,next) {
            //sets the themeRootFile to tell the views which root file they should extend.
            res.locals.themeRootFile = 'index.html';
            //makes the config variables available for this request
            res.locals.config = require(path.join(app.rootDir, 'views', 'config'));
            // trigger callback to call the next app.use directive right below this one.
            // if next() is missing the app will STOP here and break!
            next();
        });
        
        //parses cookies for express.session
        app.use(express.cookieParser());
        
        //enables memorystorage for sessions, replace with redis in production
        app.use(express.session(/*{ store: new RedisStore({
            host: 'redis.irstack.com',
            port: 6379,
            pass: ''}), 
            secret: ''
        }*/));
        
        //######## USER AUTHENTICATION MIDDLEWARE
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(function (req, res, next) {
            if (req.session && req.session.user) {
                res.locals.user = req.session.user;
            }
            
            // adds the res.locals.mobile string to the name of the loaded main.css file (main-mobile.css)
            if (utils.isMobile(req)) {
                console.log('its mobile');
                res.locals.mobile = "-mobile";
            }
        });
        // the loaded url is NOT static NOT css NOT a faviconload router
        app.use(app.router);
    });
// end first app configure 

    //gets executed if we are in NODE_ENV='development'
    app.configure('development', function () {
        //dumps exceptions to console and breaks, shows debug info
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });
    
    //gets executed if we are in NODE_ENV='production'
    app.configure('production', function () {
        //no dump, no debug info
        app.use(express.errorHandler());
    });

    //call callback to allow the app to continue the request,
    //if this is missing or not passed to configure.do the app wont start the server!
    if (typeof cb === 'function') {
        cb();
    }
};
