
var app = global.app,
	TIMEZONE_OFFSET = app.get('TIMEZONE_OFFSET'),
	InModules = app.get('InModules'),
	MsgTypes = app.get('MsgTypes'),
	usersModel = app.get('usersModel'),
	cydsModel = app.get('cydsModel'),
	wxRouters = app.get('wxRouters'),
	gotoModule = app.get('gotoModule'),
	profileSize;

app.configure(function() {
	app.set('m_cyds_me_profileSize', profileSize = 60);
});

module.exports = function(reqObj, callback) {
	var msgIn = reqObj.content, msgOut = '',
		userName = reqObj.fromUserName;
	
	if (msgIn === '0') {
		gotoModule(InModules.CYDS, reqObj, callback);
	} else if (msgIn === '1') {
		var profile = '';
		cydsModel.update({
			userName: userName
		}, {
			profile: profile,
			lastUpdate: getDate().getTime()
		}, function(err, num) {
			msgOut = getWelcomeStr(profile);
			sendMsg(msgOut);
		}, {
			upsert: true
		});
	} else if (msgIn) {
		var profile = msgIn.slice(0, profileSize);
		cydsModel.update({
			userName: userName
		}, {
			profile: profile,
			lastUpdate: getDate().getTime()
		}, function(err, num) {
			msgOut = getWelcomeStr(profile);
			sendMsg(msgOut);
		}, {
			upsert: true
		});
	} else {
		cydsModel.findOne({
			userName: userName
		}, function(err, doc) {
			var profile = '';
			if (doc) {
				profile = doc.profile;
			}
			msgOut = getWelcomeStr(profile);
			sendMsg(msgOut);
		});
	}
	
	function getDate() {
		var now = new Date(), ofs = now.getTimezoneOffset();
		return new Date(now.getTime() + (TIMEZONE_OFFSET-ofs)*3600000);
	}
	function getWelcomeStr(profile) {
		return [
			'[创业大赛组队-个人简历]',
			'我的简历: '+ (profile || ' - '),
			'回复`0` 返回',
			'回复`1` 删除简历',
			'回复其他 填写简历(姓名/专长/联系方式 '+ profileSize +'字以内)'
		].join('\n');
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
