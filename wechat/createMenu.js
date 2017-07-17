const request = require('request')
var token = require('./getToken.js')

const menu = {
    button: [
        {
            name: 'hello',
            type: 'click',
            key: 'hello'
        }
    ]
}


const createMenu = (req, res) => {
    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token()}`
    var r = request.post(url, {form: JSON.stringify(menu)}, (err, response, body) => {
        res.send(String(body))
    })
}

module.exports = createMenu
