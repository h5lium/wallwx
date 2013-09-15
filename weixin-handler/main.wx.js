
var app = global.app,
	InModules = app.get('InModules'),
	MsgTypes = app.get('MsgTypes'),
	usersModel = app.get('usersModel'),
	wxRouters = app.get('wxRouters'),
	gotoModule = app.get('gotoModule');

module.exports = function(reqObj, callback) {
	var msgIn = reqObj.content, msgOut = [
		'欢迎来到【ETips微信墙】',
		'回复`1` 创业大赛组队'
	].join('\n');
	
	if (msgIn === '1') {
		gotoModule(InModules.CYDS, reqObj, callback);
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