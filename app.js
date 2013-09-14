var http = require('http'),
express = require('express'),
app = express(),
mongoInit = require('./lib/mongo-init'),
config = {
	port: process.APP_PORT || 80,
	mongo: {
		host: process.env.BAE_ENV_ADDR_MONGO_IP,
		port: process.env.BAE_ENV_ADDR_MONGO_PORT,
		username: process.env.BAE_ENV_AK,
		password: process.env.BAE_ENV_SK,
		dbname: 'SlRCknzTFtIiRrMZoove'
	}
}, _ = global._ = require('underscore');

app.configure(function() {
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(require('./lib/raw-body'));
	app.use(express.static(__dirname + '/public'));
});

mongoInit(config.mongo, function(err, db) {
	if (err) {
		console.error('Mongo init error!');
		return;
	}
	global.db = db;
	var wallwx = require('./wallwx');
	
	app.get('/wx', wallwx.onValid);
	app.post('/wx', wallwx.onMessage);
	http.createServer(app).listen(config.port);
});
