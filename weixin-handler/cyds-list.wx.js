
var app = global.app,
	_ = app.get('_'),
	TIMEZONE_OFFSET = app.get('TIMEZONE_OFFSET'),
	InModules = app.get('InModules'),
	MsgTypes = app.get('MsgTypes'),
	usersModel = app.get('usersModel'),
	cydsModel = app.get('cydsModel'),
	wxRouters = app.get('wxRouters'),
	gotoModule = app.get('gotoModule'),
	numPerPage;

app.configure(function() {
	app.set('m_cyds_list_numPerPage', numPerPage = 5);
});

module.exports = function(reqObj, callback) {
	var msgIn = reqObj.content, msgOut = '';
	
	if (msgIn === '0') {
		gotoModule(InModules.CYDS, reqObj, callback);
	} else {
		var page = parseInt(msgIn) || 1;
		cydsModel.count({
			profile: {$ne: ''}
		}, function(err, count) {
			cydsModel.find({
				profile: {$ne: ''}
			}, function(err, docs) {
				msgOut = getWelcomeStr(_.reduce(docs, function(memo, doc) {
					memo.push(doc.profile);
					return memo;
				}, []), page, Math.ceil(count / numPerPage));
				sendMsg(msgOut);
			}, {
				sort: [['lastUpdate', -1]],
				skip: (page - 1) * numPerPage,
				limit: numPerPage
			});
		});
	}
	
	function getDate() {
		var now = new Date(), ofs = now.getTimezoneOffset();
		return new Date(now.getTime() + (TIMEZONE_OFFSET-ofs)*3600000);
	}
	function getWelcomeStr(profiles, curPage, numPages) {
		return [
			'[创业大赛组队-简历列表]',
			'第 '+ curPage +' / '+ numPages +' 页: ',
			_.reduce(profiles, function(memo, val, i) {
				return memo + (memo && '\n') + (i + 1) + '. ' + val;
			}, ''),
			'回复`0` 返回',
			'回复数字n 进入第n页'
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
