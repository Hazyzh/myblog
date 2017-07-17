'use strict';

require('babel-polyfill');
var crypto = require("crypto");
var xml2js = require('xml2js');
var builder = new xml2js.Builder({
    cdata: true,
    headless: true,
    rootName: 'xml'
});

var parser = new xml2js.Parser({
    trim: true,
    explicitArray: false
});

function sha1(str) {
    var md5sum = crypto.createHash("sha1");
    md5sum.update(str);
    str = md5sum.digest("hex");
    return str;
}

var token = 'hazyzh';
var wechatGet = function wechatGet(req, res) {

    if (!!req.query.echostr) {
        var signature = req.query.signature,
            timestamp = req.query.timestamp,
            nonce = req.query.nonce,
            echostr = req.query.echostr;

        var str = [token, timestamp, nonce].sort().join('');
        var resStr = sha1(str);

        if (resStr == signature) {
            res.end(echostr);
        } else {
            res.end('err');
        }
    } else {
        var xmlstr = req.body;
    }
};
// 消息
var wechatPost = function wechatPost(req, res) {
    var xmlstr = req.body;

    parser.parseString(xmlstr, function (err, data) {
        if (!err) {
            var info = data.xml;

            var newinfo = {
                ToUserName: info.FromUserName,
                FromUserName: info.ToUserName,
                CreateTime: Date.parse(new Date()) * 0.001,
                MsgType: 'text',
                Content: info.Content,
                MsgId: info.MsgId
            };
            res.send('11');
            // res.send(xmlbuilder(newinfo))
        }
    });
};

var xmlbuilder = function xmlbuilder(obj) {
    var innerStr = Object.entries(obj).map(function (d) {
        return '<' + d[0] + '><![CDATA[' + d[1] + ']></' + d[0] + '>';
    }).join('');
    return '<xml>' + innerStr + '</xml>';
};

module.exports = {
    get: wechatGet,
    post: wechatPost
};
