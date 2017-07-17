var crypto = require("crypto")
var xml2js = require('xml2js')
var builder = new xml2js.Builder({
    cdata: true,
    headless: true,
    rootName: 'xml'
})

var parser = new xml2js.Parser({
    trim: true,
    explicitArray: false
})



function sha1(str){
  var md5sum = crypto.createHash("sha1")
  md5sum.update(str)
  str = md5sum.digest("hex")
  return str
}


const token = 'hazyzh'
const wechatGet = (req, res) => {

    if(!!req.query.echostr) {
        var signature = req.query.signature,
            timestamp = req.query.timestamp,
            nonce = req.query.nonce,
            echostr = req.query.echostr

        var str = [token, timestamp, nonce].sort().join('')
        var resStr = sha1(str)

        if(resStr == signature) {
            res.end(echostr)
        } else{
            res.end('err')
        }
    } else {
        res.end('err')
    }
}


// 消息
const wechatPost = (req, res) => {
    var info = req.body.xml
    console.log(info, typeof(info))
    var newinfo = {
        ToUserName: info.fromusername[0],
        FromUserName: info.tousername[0],
        CreateTime: Date.parse(new Date()) * 0.001,
        MsgType: 'text',
        Content: info.content[0],
        MsgId: info.msgid[0]
    }
    res.set({'Content-Type': 'application/xml'})

    var redirect_uri = 'http%3a%2f%2fhazyzh.com%2fwechat2'
    var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe0220cd8d7ab5de3&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"

    var info2 = {
        ToUserName: info.fromusername[0],
        FromUserName: info.tousername[0],
        CreateTime: Date.parse(new Date()) * 0.001,
        MsgType: 'news',
        ArticleCount: 1,
        Articles: [
            {
                item:{
                    Title: '123',
                    Description: '324',
                    PicUrl: 'https://img3.doubanio.com/dae/niffler/niffler/images/5d4c6716-5676-11e7-bb3d-0242ac11002d.jpg',
                    Url: url
                }
            }
        ],
        MsgId: info.msgid[0]
    }
    var data
    if (newinfo.Content == 1) {
        data = builder.buildObject(info2)
    } else {
        data = builder.buildObject(newinfo)
    }


    res.send(data)
}

const xmlbuilder = (obj) => {

    var getarr = () => {
        var arr = []
        for(var i in obj){
            var arr2 = []
            arr2.push(i, obj[i])
            arr.push(arr2)
        }
        return arr
    }

    var innerStr = getarr().map(d=>{
        if(d[0]=='CreateTime' || d[0]=='MsgId') {
            return `<${d[0]}>${d[1]}</${d[0]}>`
        }
        return `<${d[0]}><![CDATA[${d[1]}]></${d[0]}>`
    }).join('')
    return '<xml>'+innerStr+'</xml>'
}

module.exports = {
    get: wechatGet,
    post: wechatPost
}
