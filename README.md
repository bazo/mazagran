mazagran
========

Opinionated  node.js framework

## Getting started

create a server.js file

````
//require mazagran
var mazagran = require('mazagran');

var configuration = mazagran.configuration;
configuration.addConfig('config.json'); //add a config file

//create DI container
var DIFactory = mazagran.DIFactory;
var configurator = new DIFactory(configuration);
configurator.basePath = __dirname; //DI will look for the services realtive to this path,
var di = configurator.create();

//add routes
var router = mazagran.router;

router.match('/').to('homepage.list');
router.match('/:controller/:action(/:id)');


var App = mazagran.App;
var app = new App(di, router);

//run the application!
app.run();
````

and that's it

Now all you need to do is add controllers and templates

## Recommended file structure

These are also assumed defaults:

````
root/
    - server.js
    - controllers/
    - templates/
    - logs/
    - www/
````

## Routing

Routing uses https://github.com/kieran/barista so refer to that for documentation

##Controllers

should look like this:

````

//assuming a route router.match('/:controller/:action(/:id)');

function Homepage() {

	/*
		will match /homepage/index
		name will come from either POST body or GET query ?name=Martin
	*/
	this.index = function(name) {

		var data = {
				name: name
			};

		this.view.render('index', data);
	};

	//will match /homepage/list
	this.list = function() {
		var data = [
			{id: 1, name: 'peto'},
			{id: 2, name: 'miso'},
			{id: 3, name: 'tomas'},
			{id: 4, name: 'mato'},
			{id: 5, name: 'juro'}
		];
		this.view.render('list', {persons: data});
	};

	//will match /homepage/user/1 id will be 1
	this.user = function(id) {
		this.view.render('user', {id: id});
	};
};

module.exports = Homepage;
````

## Middleware

Mazagran is built on top of connect so it can accept any middleware compatible

just add to server.js
````
app.use(middleware);
````

default middlewares:
````
connect.static
connect.query
passport
quip
body-parser
connect-powered-by
connect-flash
````

## Templating

Templating uses nunjucks engine http://jlongster.github.io/nunjucks/
Templates reside by default in templates/ directory and have extension of .html
Templates support layouts, inheritance and blocks

## Dependency injection

Mazagran uses dependency injection https://github.com/sakren/node-dependency-injection
Configuration https://github.com/sakren/node-easy-configuration

Mazagran also uses Configuration and DI for its internal services configuration

````
//default parameters, you can override them in your config.json
"parameters": {
		"server": {
			"host": "0.0.0.0",
			"port": 8080
		},
		"templates": {
			"path" : "./templates/",
			"defaultExtension" : "html"
		},
		"controllers": {
			"path": "./controllers"
		},
		"statics": {
			"path": "./www",
			"maxAge": 86400000
		},
		"logs": {
			"dir": "./logs"
		}
	},
````

default overridable services:
````
view
logger
````

### Controllers and DI

You can require any service defined in DI config in your controllers by their names, they will be automatically autowired

````
function Homepage(view, logger) {
	console.log(view, logger);
}
````

## Logging

Mazagran uses winston for logging
By default there are 3 log files created
access.log - logs accesses
error.log - logs all error types
info.log - logs info and debug messages

## Async

Mazagran uses async library https://github.com/caolan/async to organize its code
It's also available in DI container by default, so you can use it in your controllers

