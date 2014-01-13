module.exports = function(req, res, next){
	req.isAjax = function(){
		var isAjax = false;

		if(req.headers.hasOwnProperty('x-requested-with')) {
			isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest' ? true : false;
		}

		return isAjax;
	};

	req.isGet = function() {
		return req.method === 'GET';
	};

	req.isPost = function() {
		return req.method === 'POST';
	};

	req.getUser = function() {
		if(typeof(req.user) === 'undefined') {
			return null;
		}

		return req.user;
	};
	next();
};