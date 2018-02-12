const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const tools = require('../util/tools')
//api 分发
const API_V1 = require('./api/api_v1')
const demo_handler = require('./demo_handler')
//make db 
var db = require('./db')
db.createDB()
const app = express()
//demo
//app.use(express.static('../../demo'))
app.use('/demo', demo_handler)
//middlewares
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

//static resource 就是静态的文件，请求html的时候直接是一个全是文本 不是页面
app.use(express.static(path.resolve(__dirname, '../static')))

//跨域
app.all('*', function(req, res, next) {
  //log req header
  let ol = req.originalUrl,
    ip = require('../util/getClientIP').getClientIp(req),
    method = req.method,
    s = ''

  for(var name in req.headers) {
    s += `${name} : ${req.headers[name]} ;\n`
  }
  db.getDB().log(`Method:${method}; OriginalURL: ${ol}; Ip: ${ip};\n` + s, true) //IS_MUTE = TRUE
  res.header("Access-Control-Allow-Origin", '*');
//res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//api
app.use('/api/v1/', API_V1())

//test
app.use('/', function(req, res, next) {
  res.send({
  	code:0,
  	msg :'运行中'
  })
})
app.use(function(req, res, next) {
  res.status(404).end('404 NOT FOUND');
  //res.send();
});
app.listen(8000)