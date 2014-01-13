//system
var fs = require('fs');
var http = require('http');

//middleware
var connect = require('connect');
var quip = require('quip');
var passport = require('passport');
var poweredBy = require('connect-powered-by');
var merge = require('deepmerge');
var bodyParser = require('body-parser');
var request = require('./request');
var flash = require('connect-flash');

//tools
var Logger = require('./logger');
var HttpStatus = require('http-status-codes');
var async = require('async');


//di
var Helpers = require('dependency-injection/lib/Helpers');

var App = function(di, router) {

	var controllers = {};
	var argumentsCache = [];

	var app = connect();

	app.use(poweredBy('Mazagran'))
			.use(connect.static(fs.realpathSync(di.parameters.statics.path), {maxAge: 86400000}))
			.use(connect.query())
			.use(bodyParser()) //doesnt parse multipart, is that a problem?
			.use(quip)
			.use(connect.responseTime())
			.use(request)
			.use(flash())
			.use(passport.initialize())
			.use(passport.session());

	//add router to view for url generation
	var view = di.get('view');
	view.router = router;

	var logger = di.get('logger');

	this.use = function(middleware) {
		app.use(middleware);
	};

	this.main = function(req, res) {
		logger.access('%s HTTP/%s %s %s', req.method, req.httpVersion, req.url, req.headers['user-agent']);
		async.waterfall([
			function(callback) {
				router.first(req.url, req.method, function(undefined, params) {

					if (typeof (params) === 'undefined' || !params.hasOwnProperty('controller')) {
						var err = new Error('Route not found');
						err.code = 404;
						callback(err, null);
						return;
					}

					var controllerName = params.controller;
					var actionName = params.action;

					var controller = controllers[controllerName];

					if (typeof (controller) === 'undefined') {
						var err = new Error('Route not found');
						err.code = 404;
						callback(err, null);
						return;
					}

					var action = controller[actionName];
					if (typeof (action) === 'undefined') {
						var err = new Error('Route not found');
						err.code = 404;
						callback(err, null);
						return;
					}

					var queryParams = req.query;
					var bodyParams = req.body;

					var parameters = merge(params, merge(queryParams, bodyParams));

					view.response = res;

					controller.request = req;
					controller.response = res;
					controller.view = view;
					controller.passport = passport;

					var argumentsCacheKey = controllerName + '.' + actionName;
					var argNames = argumentsCache[argumentsCacheKey];

					async.map(argNames, function(argName, callback) {
						var value = parameters.hasOwnProperty(argName) ? parameters[argName] : null;
						callback(null, value);
					}, function(err, results) {
						if (err) {
							err.code = 500;
						}
						callback(err, action, controller, results);
					});
				});
			},
			function(action, controller, results, callback) {
				try {
					action.apply(controller, results);
				} catch (err) {
					callback(err);
					return;
				}
			}
		], function(err) {
			logger.error('%d: %s', err.code, err.message, err.stack);
			
			//todo: create error controller
			switch (err.code) {
				case HttpStatus.NOT_FOUND:
					res.notFound().text(err.message);
					break;

				case HttpStatus.INTERNAL_SERVER_ERROR:
					res.error().text('Internal server error.');
					break;

				default:
					res.error().text(err.message);
					break;
			}
			res.end();
		});
	};

	this.autowireControllers = function() {
		var controllerFiles = fs.readdirSync(di.parameters.controllers.path);
		for (var i in controllerFiles) {
			var path = fs.realpathSync(di.parameters.controllers.path + '/' + controllerFiles[i]);
			var definition = require(path);

			var name = definition.name.toLowerCase();
			var controller = di.createInstance(definition);
			controllers[name] = controller;

			for (var property in controller) {
				if (typeof (controller[property]) === 'function') {
					var args = Helpers.getArguments(controller[property]);
					var key = name + '.' + property;
					argumentsCache[key] = args;
				}
			}
		}
	};

	this.run = function(callback) {

		this.autowireControllers();

		app.use(this.main);

		//start the server
		var server = http.createServer(app).listen(di.parameters.server.port, di.parameters.server.host, function() {
			var address = server.address();
			logger.info("server listening on %s:%s", address.address, address.port);
			if (typeof (callback) !== 'undefined') {
				callback(app, server);
			}
		});
	};

};

module.exports = App;