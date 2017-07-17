const request = require('request')
const url = require('url')
const qs = require('querystring')

const appID = 'wx4aa4836d516a1ce3'
const secret = '73b81be406ab22187ca5e78a8d129e93'
const grant_type = 'client_credential'
var token

const payload = { appID, secret, grant_type }
const params = qs.stringify(payload)
const baseUrl = 'https://api.weixin.qq.com/cgi-bin/token'
const requsetUrl = baseUrl + '?' + params
function getToken() {
    request.get(requsetUrl, function(err, response, body){
        console.log(body)
        if(!err){
            var info = JSON.parse(body)
            token = info.access_token
        }
    })
}

getToken()

// 100分钟刷新一次token
setInterval(getToken, 1000 * 60 * 100)

const func = () => token

module.exports = func
