
var ContentModel = global.ContentModel = require('../models/ContentModel'),
	usersModel = global.usersModel = new ContentModel(global.db, 'users');


var MsgTypes = global.MsgTypes = {
	TEXT: 'text', IMAGE: 'image', LOCATION: 'location', LINK: 'link',
	EVENT: 'event', MUSIC: 'music', NEWS: 'news'
}, InModules = global.InModules = {
	MAIN: 'main', CYDS: 'cyds', CYDS_ME: 'cyds-me'
}, wxRouters = global.wxRouters = {}

_.each(InModules, function(val) {
	wxRouters[val] = require('./'+ val + '.wx');
});


module.exports = function(reqObj, callback) {
	getUser(reqObj.fromUserName, function(user) {
		var router = wxRouters[user.inModule] || wxRouters[InModules.MAIN];
		router(reqObj, callback);
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
				callback(num ? newUser : null);
			});
		} else {
			callback(user);
		}
	});
}