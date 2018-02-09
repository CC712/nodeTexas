const http = require('http')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const api_player = require('./route/api_player')
// server 的调用是否合理？
/*let http_conf = {
 *port: 8080,
 *server: 'app'
 *}
 */

exports.init = function(h_conf) {
  var app = express();
  app.listen(h_conf.port);
  //console.log(`http server listen at port : ${h_conf.port}`)
  // 中间件 按顺序
  // 分析 
  app.use(bodyParser());
  // app.delete app.put  模拟 delete put 因为form默认是post 可以重写，就是换请求方式
  //app.use(express.methodOverride());
  var s = h_conf.server
  //app.use(api())
  app.use(express.static(path.join(__dirname, '../static')));
  app.all('/api', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    //res.setEncoding('utf8');
    s.db.log(req.ip);
    //请求体 全部用 url请求？
    for(var key in req.query) {
      s.db.log("key:" + key);
      s.db.log("req[key]:" + req.query[key]);
    }
    next();

  });

  //restful api 
  app.use('/api/player', api_player)
  app.use('/', function(req, res) {
    res.send('运行中');
  });

  app.use(function(req, res, next) {
    res.status(404);
    res.send('404 NOT FOUND');
  });
  //console.log("__dirname:"+__dirname);
  s.db.log("listen " + h_conf.port + " http ok");
};