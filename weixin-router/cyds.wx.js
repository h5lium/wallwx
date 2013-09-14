
var MsgTypes = global.MsgTypes,
	InModules = global.InModules,
	wxRouters = global.wxRouters,
	usersModel = global.usersModel;


module.exports = function(reqObj, callback) {
	var msgIn = reqObj.content, msgOut = [
		'[创业大赛组队]',
		'回复`0` 返回',
		'回复`1` 寻找队员',
		'回复`2` 个人简历'
	].join('\n'),
	userName = reqObj.fromUserName;
	
	if (msgIn === '0') {
		var nextModule = InModules.MAIN;
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
	} else if (msgIn === '1') {
		msgOut = '1';
		sendMsg();
	} else if (msgIn === '2') {
		var nextModule = InModules.CYDS_ME;
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
			toUserName: reqObj.fromUserName,
			fromUserName: reqObj.toUserName,
			msgType: MsgTypes.TEXT,
			content: msgOut
		});
	}
}
