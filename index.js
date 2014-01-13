'use strict';

//system
//var fs = require('fs');
//var http = require('http');

//middleware
/*
var connect = require('connect');
var quip = require('quip');
var passport = require('passport');
var poweredBy = require('connect-powered-by');
var merge = require('deepmerge');
var bodyParser = require('body-parser');
var request = require('./libs/request');
*/
//DI
var DIFactory = require('dependency-injection/DIFactory');
var Configuration = require('dependency-injection/Configuration');
var Helpers = require('dependency-injection/lib/Helpers');


//Tools
//var HttpStatus = require('http-status-codes');
//var async = require('async');


//Router
var Router = require('barista').Router;
var router = new Router;


//Default config
var configuration = new Configuration;
//default config have to figure out the paths
configuration.addConfig('./config/config.json');

var App = require('./libs/app');

module.exports.DIFactory = DIFactory;
module.exports.configuration = configuration;
module.exports.router = router;
module.exports.App = App;


/*
var server = http.createServer(app).listen(parameters.server.port, parameters.server.host, function() {
	var address = server.address();
	logger.info("server listening on %s:%s", address.address, address.port);
});
*/