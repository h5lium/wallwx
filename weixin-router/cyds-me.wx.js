
var MsgTypes = global.MsgTypes,
	InModules = global.InModules,
	wxRouters = global.wxRouters,
	usersModel = global.usersModel;


var cydsModel = new global.ContentModel(global.db, 'm-cyds');


module.exports = function(reqObj, callback) {
	var maxLength = 50;
	var msgIn = reqObj.content, msgOut = '',
	userName = reqObj.fromUserName;
	
	cydsModel.findOne({
		userName: userName
	}, function(err, doc) {
		var profile = '';
		if (doc) {
			profile = doc.profile;
		}
		msgOut = getMenu(profile);
		
		if (msgIn === '0') {
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
		} else if (msgIn) {
			profile = msgIn.slice(0, maxLength);
			cydsModel.update({
				userName: userName
			}, {
				profile: profile
			}, function(err, num) {
				if (num) {
					msgOut = getMenu(profile);
				}
				sendMsg();
			}, {
				upsert: true
			});
		} else {
			sendMsg();
		}
	});
	
	function getMenu(profile) {
		return [
			'[创业大赛组队-个人简历]',
			'我的简历: '+ profile,
			'回复`0` 返回',
			'回复其他 填写简历(姓名/专长/联系方式 '+ maxLength +'字以内)'
		].join('\n');
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
