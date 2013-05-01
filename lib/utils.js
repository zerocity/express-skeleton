"use strict";

var moment = require('moment'),
    special_chars = [ {key: "\u00e4", val: "ae"},
                      {key: "\u00fc", val: "ue"}, 
                      {key: "\u00f6", val:"oe"}, 
                      {key:"\u00df", val:"ss"} 
                    ];

var utils = module.exports = {

    slugify: function slugify(slug) {
        var special_char_string = '/special_chars[0].key|special_chars[1].key|special_chars[2].key|special_chars[3].key]/g';
        //first replace spaces with underscores and lowercase the slug
        slug = slug.replace(/\s/g, '_').toLowerCase();
        
        //replace äüö with ae ue and oe for german titles
        //later add support for more/other special chars defined in the admin interface
        //removing the need of adding them all here and always test against those that we need to test against
        slug = slug.replace(special_char_string, function($0) { return special_chars[$0].val });
        
        //remove all remaining specialchars, i dont like multiple underscores, so replace with nothing?
        slug = slug.replace(/[^a-z0-9_]+/g, '');
        
        return slug;
    },

      // Simple route middleware to ensure user is authenticated.
      //   Use this route middleware on any resource that needs to be protected.  If
      //   the request is authenticated (typically via a persistent login session),
      //   the request will proceed.  Otherwise, the user will be redirected to the
      //   login page.
    ensureAuthenticated: function ensureAuthenticated(req, res, next) {

        if (req.isAuthenticated()) { return next(); }

        res.redirect('/login');
    },

    validateEmail: function validateEmail(elementValue) {
        var emailPattern = /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/;

        return emailPattern.test(elementValue);
    },

    isMobile: function isMobile(req) {
        var ua = req.header('user-agent');
        if (/mobile/i.test(ua)) {
            return true;
        } else {
            return false;
        }
    }
};
