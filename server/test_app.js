const log = require('./log')
const DB = require('./db').DB
const http = require('./http')

let dbConfig = {
  db_name: 'server',
  db_ip: 'localhost',
  db_port: '27017'
}
var server = function(conf, cb = () => {}) {
  //DB
  new DB(conf, this, cb)
}
server.prototype.init = function() {}
// 总的game 
let tt = new server(dbConfig, () => {
  let p3 = tt.db.find('server', {
    name: /c3/
  }, {
    limit: 3
  })
  let p4 = tt.db.find('log', {}, {
    limit: 3
  })
  //关闭连接，其实是可以不用的，因为后端单线程 而且一直运行
  // 	Promise.all([p1,p2,p3,p4]).then(()=>{
  // 		log('关闭连接')
  // 		tt.db.close()
  // 	})
  
  //http 通信服务器
  let http_conf = {
    port: 8080,
    server: tt
  }
  http.init(http_conf)

})