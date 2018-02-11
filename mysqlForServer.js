var mysql = require('mysql')
const config = {
    host: 'rm-bp1mtn37322i8u9an.mysql.rds.aliyuncs.com',
    user: 'root',
    password: 'a!^%asa$@HFs12#',
    database: 'hazyzh',
    port: 3306
}
var pool = mysql.createPool(config)

var connection = {
    query: (sql, options, callback) => {
        if (typeof(options) == 'function') {
            callback = options
            options = null
        }
        pool.getConnection((err, conn) => {
            if(err) {
                 callback && callback(err,null,null)
            } else {
                conn.query(sql,options,function(err,results,fields){
                   //释放连接
                   conn.release();
                   //事件驱动回调
                   callback && callback(err,results,fields)
               })
            }
        })
    }
}


module.exports = connection
