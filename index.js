var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer({ dest: './hazy/uploads/' })
var moment = require('moment')
var xmlparser = require('express-xml-bodyparser')
// wechat
var wechat = require('./wechat/wechat.js')
// var createMenu = require('./wechat/createMenu.js')

app.use(xmlparser())
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.text({ type: 'text/xml' })) //for xml
app.use(upload); // for parsing multipart/form-data

var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if(req.method=="OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
    else  next();
};
app.use(allowCrossDomain)

app.use(express.static('hazy'));







// app.get('/createmenu', createMenu)

app.post('/forweek', function (req, res) {
    var txt = req.body.daily
    var arr = txt.split(/\d+、{1}/).slice(1)
    var newarr = arr.map((str, index) => {
        return  index+1+'、'+str
    })
    var content = newarr.join("")

    res.json({ content })
});

app.post('/upload', function(req, res){
    res.json(req.files)
})

app.post('/chat', function(req, res){
    var user = req.body.user
    var msg = req.body.msg
    res.json({hello: 'name'})
})

app.get('/chat2', function(req, res){
    var user = req.query.name
    res.json({hello: user})
})





// wechat
app.get('/wechat', wechat.get)
app.post('/wechat', xmlparser({trim: true, explicitArray: false}), wechat.post)
// var wechat = require('wechat')
// var config = {
//   token: 'hazyzh',
//   appid: 'wx4aa4836d516a1ce3',
//   encodingAESKey: 'IArxnEtir5MYQHUssuKfCJrb9OdZ0lF6Uy3io4KUFab',
//   checkSignature: false // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
// }
// app.use(express.query())
// app.use('/wechat', wechat(config, function (req, res, next) {
//   // 微信输入信息都在req.weixin上
//   var message = req.weixin
//   if (message.Content == 'hi'){
//       res.reply('hehe')
//   } else {
//       res.reply([
//         {
//           title: 'hahah',
//           description: 'aaaa',
//           picurl: 'https://img1.doubanio.com/view/photo/photo/public/p2462131578.webp',
//           url: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe0220cd8d7ab5de3&redirect_uri=http%3a%2f%2fhazyzh.com%2fwechat&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
//         }
//       ])
//   }
// }))



var server = app.listen(80, function(){
    var info = server.address()
    var host = info.address
    var port = info.port

    console.log('Example app listening at http://%s:%s', host, port)
})
var numbers = 0
const io = require('socket.io')(server)
// socket
io.on('connection',function(socket) {
    var addUser = false

    socket.on('disconnect', function() {
        if(addUser){
            numbers--

            socket.broadcast.emit('userLeave', {userName: addUser, numbers})
        }
    })

    socket.on('chat message', function(msg) {
        var time = moment().format('YYYY/MM/DD HH:mm:ss')
        io.emit('chat message', {userName: addUser, msg, time})
    })

    socket.on('login', function(userName) {
        if(addUser) { return false }

        numbers++
        addUser = userName

        socket.emit('login ok', numbers)
        socket.broadcast.emit('addUser', {userName, numbers})
    })
})
