'use strict';

var nodemailer = require('nodemailer'),
    mail = 'microcmsmailtest@gmail.com'; //your mail address the contact page should use

module.exports = {
    name      : 'express-skeleton',             // name of this app
    author    : 'metalab lounge',        //your name or the name of your company
    protocol  : 'http://',          //http or https
    url       : 'dev',                        //url this app can be reached at 
    version   :  '0.0.1',                           //the version number of this application.
    port      : 2323,                               //the port this runs on
    email     : mail,                               //your mail address the contact page should use
    smtp      : nodemailer.createTransport('SMTP', {//setup nodemailer
        service: 'Gmail',                           //uses gmail as default, see the nodemailer docs for other options
        auth: {
            user: mail,                             //the email your smtp server should use to forward the mails from the contact page
            pass: 'microcmspassword'                //the password of your smtp server
        }
    }),
};
