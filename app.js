
var http = require('http'),
	express = require('express'),
	_ = require('underscore'),
	mongoInit = require('./lib/mongo-init'),
	app = global.app = express();

app.configure(function() {
	app.set('config', {
		port: process.APP_PORT || 80,
		mongo: {
			host: process.env.BAE_ENV_ADDR_MONGO_IP,
			port: process.env.BAE_ENV_ADDR_MONGO_PORT,
			username: process.env.BAE_ENV_AK,
			password: process.env.BAE_ENV_SK,
			dbname: 'SlRCknzTFtIiRrMZoove'
		}
	});
	app.set('_', _);
	app.set('TIMEZONE_OFFSET', 8);
	app.set('dirPublic', __dirname + '/public');
	
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(require('./lib/raw-body'));
	app.use(express.static(app.get('dirPublic')));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

var config = app.get('config');
mongoInit(config.mongo, function(err, db) {
	if (err) {
		console.error('Mongo init error!');
		return;
	}
	app.configure(function() {
		app.set('db', db);
	});
	var wallwx = require('./wallwx');	// require db open
	
	app.get('/wx', wallwx.onValid);
	app.post('/wx', wallwx.onMessage);
	http.createServer(app).listen(config.port);
});
