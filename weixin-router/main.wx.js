
var MsgTypes = global.MsgTypes,
	InModules = global.InModules,
	wxRouters = global.wxRouters,
	usersModel = global.usersModel;


module.exports = function(reqObj, callback) {
	var msgIn = reqObj.content, msgOut = [
		'欢迎来到【ETips微信墙】',
		'回复`1` 创业大赛组队'
	].join('\n'),
	userName = reqObj.fromUserName;
	
	if (msgIn === '1') {
		var nextModule = InModules.CYDS;
		usersModel.update({
			userName: userName
		}, {
			inModule: nextModule
		}, function(err, num) {
			if (num) {
				reqObj.content = '';
				wxRouters[nextModule](reqObj, callback);
			} else {
				sendMsg();
			}
		});
	} else {
		sendMsg();
	}
	
	function sendMsg() {
		callback({
			toUserName: userName,
			fromUserName: reqObj.toUserName,
			msgType: MsgTypes.TEXT,
			content: msgOut
		});
	}
}