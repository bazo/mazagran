var View = function(pathToTemplates, defaultExtension, nunjucks) {

	nunjucks.configure(pathToTemplates, {autoescape: true});

	this.response = null;
	this.router = null;

	this.helpers = function(router) {
		this.url = function(controllerActionString, params) {

			var parts = controllerActionString.split(':');
			var controller = parts[0];
			var action = parts[1];

			if (typeof (params) === 'undefined') {
				params = {};
			}

			params.controller = controller;
			params.action = action;

			var url = router.url(params, true);
			return url;
		};

		return this;
	};


	this.render = function(template, data, callback) {
		var response = this.response;

		var helpers = this.helpers.call(this.helpers, this.router);
		data.helpers = helpers;
		nunjucks.render(template + '.' + defaultExtension, data, function(err, output) {
			if (err) {
				throw err;
			}
			response.html(output);
		});
	};

};

module.exports = View;