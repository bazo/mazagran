var fs = require('fs');
var winston = require('winston');
var moment = require('moment');

var levels = {
	emerg: 0,
	alert: 1,
	crit: 2,
	error: 3,
	warning: 4,
	notice: 5,
	info: 6,
	debug: 7,
	access: 8
};

var colors = {
	emerg: 'red',
	alert: 'yellow',
	crit: 'red',
	error: 'red',
	warning: 'red',
	notice: 'yellow',
	info: 'green',
	debug: 'blue',
	access: 'yellow'
};

var Logger = function(dir) {

	var logsDir = fs.realpathSync(dir);

	var errorLogger = new (winston.Logger)({
		levels: levels,
		colors: colors,
		transports: [
			new (winston.transports.Console)({
				timestamp: function() {
					var now = new Date;
					return  moment(now).format('DD.MM.YYYY H:mm:ss');
				},
				colorize: true
			}),
			new (winston.transports.File)({
				name: 'file#error',
				level: 'alert',
				filename: logsDir + '/error.log'
			})
		]
	});

	var defaultLogger = new (winston.Logger)({
		levels: levels,
		colors: colors,
		transports: [
			new (winston.transports.Console)({
				timestamp: function() {
					var now = new Date;
					return  moment(now).format('DD.MM.YYYY H:mm:ss');
				},
				colorize: true
			}),
			new (winston.transports.File)({
				name: 'file#info',
				level: 'info',
				filename: logsDir + '/info.log'
			})
		]
	});

	var accessLogger = new (winston.Logger)({
		levels: levels,
		colors: colors,
		transports: [
			new (winston.transports.Console)({
				timestamp: function() {
					var now = new Date;
					return  moment(now).format('DD.MM.YYYY H:mm:ss');
				},
				colorize: true
			}),
			new (winston.transports.File)({
				name: 'file#access',
				level: 'access',
				filename: logsDir + '/access.log'
			})
		]
	});

	this.emerg = function() {
		errorLogger.emerg.apply(defaultLogger, arguments);
	};

	this.alert = function() {
		errorLogger.alert.apply(defaultLogger, arguments);
	};

	this.crit = function() {
		errorLogger.crit.apply(defaultLogger, arguments);
	};

	this.error = function() {
		errorLogger.error.apply(defaultLogger, arguments);
	};

	this.warning = function() {
		errorLogger.warning.apply(defaultLogger, arguments);
	};

	this.notice = function() {
		errorLogger.notice.apply(defaultLogger, arguments);
	};

	this.info = function() {
		defaultLogger.info.apply(defaultLogger, arguments);
	};

	this.debug = function() {
		defaultLogger.debug.apply(defaultLogger, arguments);
	};

	this.access = function() {
		accessLogger.access.apply(defaultLogger, arguments);
	};

	return this;
};

module.exports = Logger;