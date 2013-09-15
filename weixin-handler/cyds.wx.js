
var ContentModel = require('../models/ContentModel'),
	app = global.app,
	InModules = app.get('InModules'),
	MsgTypes = app.get('MsgTypes'),
	usersModel = app.get('usersModel'),
	wxRouters = app.get('wxRouters'),
	gotoModule = app.get('gotoModule'),
	cydsModel;

app.configure(function() {
	app.set('cydsModel', cydsModel = new ContentModel(app.get('db'), 'm-cyds'));
});

module.exports = function(reqObj, callback) {
	var msgIn = reqObj.content, msgOut = [
		'[创业大赛组队]',
		'回复`0` 返回',
		'回复`1` 寻找队员',
		'回复`2` 个人简历'
	].join('\n');
	
	if (msgIn === '0') {
		gotoModule(InModules.MAIN, reqObj, callback);
	} else if (msgIn === '1') {
		gotoModule(InModules.CYDS_LIST, reqObj, callback);
	} else if (msgIn === '2') {
		gotoModule(InModules.CYDS_ME, reqObj, callback);
	} else {
		sendMsg(msgOut);
	}
	
	function sendMsg(msgOut) {
		callback({
			toUserName: reqObj.fromUserName,
			fromUserName: reqObj.toUserName,
			msgType: MsgTypes.TEXT,
			content: msgOut
		});
	}
}
