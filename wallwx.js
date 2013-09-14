var domino = require('domino'),
Zepto = require('zepto-node'),
window = domino.createWindow(),
$ = Zepto(window),
wxValid = require('./lib/weixin-valid'),
TOKEN = 'etips',
wxRouter = require('./weixin-router/');


exports.onValid = function(req, res, next){
	req.query['echostr'] ? wxValid(req, res, TOKEN) : next();
}

exports.onMessage = function(req, res){
	wxRouter(parseReqObj(req.rawBody), function(resObj) {
		res.end(parseResXML(resObj));
	});
}


function parseResXML(resObj){
	return ['<xml>',
		'<ToUserName><![CDATA[', resObj.toUserName ,']]></ToUserName>',
		'<FromUserName><![CDATA[', resObj.fromUserName ,']]></FromUserName>',
		'<CreateTime>', resObj.createTime || new Date().getTime() ,'</CreateTime>',
		'<MsgType><![CDATA[', resObj.msgType || 'text' ,']]></MsgType>',
		'<Content><![CDATA[', resObj.content ,']]></Content>',
		'<FuncFlag>', resObj.funcFlag || 0 ,'</FuncFlag>',
	'</xml>'].join('');
}
function parseReqObj(reqXML){
	var $req = $('<div>').html(reqXML);
	return {
		toUserName: getCData($req.find('ToUserName').html()),
		fromUserName: getCData($req.find('FromUserName').html()),
		createTime: getCData($req.find('CreateTime').html()),
		msgType: getCData($req.find('MsgType').html()),
		content: getCData($req.find('Content').html()),
		msgId: getCData($req.find('MsgId').html())
	}
}
function getCData(str){
	return str.substring(11, str.length - 5);
}
