
var ContentModel = require('../models/ContentModel'),
	app = global.app,
	_ = app.get('_'),
	usersModel, InModules, wxRouters = {};

app.configure(function() {
	app.set('usersModel', usersModel = new ContentModel(app.get('db'), 'users'));
	app.set('MsgTypes', {
		TEXT: 'text', IMAGE: 'image', LOCATION: 'location', LINK: 'link',
		EVENT: 'event', MUSIC: 'music', NEWS: 'news'
	});
	app.set('InModules', InModules = {
		MAIN: 'main',
		CYDS: 'cyds', CYDS_LIST: 'cyds-list', CYDS_ME: 'cyds-me'
	});
	app.set('gotoModule', gotoModule);
	
	// at last
	app.set('wxRouters', wxRouters).set('wxRouters', _.reduce(InModules, function(memo, val) {
		memo[val] = require('./'+ val + '.wx');
		return memo;
	}, wxRouters));
});

module.exports = function(reqObj, callback) {
	getUser(reqObj.fromUserName, function(user) {
		var router = wxRouters[user.inModule] || wxRouters[InModules.MAIN];
		router(reqObj, callback);
	});
}

function gotoModule(nextModule, reqObj, callback) {
	usersModel.update({
		userName: reqObj.fromUserName
	}, {
		inModule: nextModule
	}, function(err, num) {
		reqObj.content = '';
		wxRouters[nextModule](reqObj, callback);
	});
}
function getUser(userName, callback) {
	usersModel.findOne({
		userName: userName
	}, function(err, user) {
		if (! user) {
			var newUser = {
				userName: userName,
				nickName: '',
				inModule: InModules.MAIN
			}
			usersModel.insert(newUser, function(err, num) {
				callback(newUser);
			});
		} else {
			callback(user);
		}
	});
}