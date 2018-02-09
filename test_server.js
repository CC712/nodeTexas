//import Controllor from './logic/js/controllor'
//import Model from './logic/js/texas'
const log = require('./base_modules/log')
const DB = require('./base_modules/db').DB
const http = require('./base_modules/http')

let user = {
  uid: 77232,
  name: 'test user'
}
let dbConfig = {
  db_name: 'server',
  db_ip: 'localhost',
  db_port: '27017'
}
var server = function(conf, cb = () => {}) {
  //DB
  new DB(conf, this, cb)
}
server.prototype.init = function() {
	//只有一个游戏场景 所以可以这么玩
	// 如果做大厅那种，多个游戏场景，那就要想办法区分了
//	this.g_model = new Model()
//	this.g_control = new Controllor(this.g_model)
}
// 总的game 
let tt = new server(dbConfig, () => {
//let p1 = tt.db.insert('server', {
//  name: 'cc3'
//})
//let p2 = tt.db.insert('server', {
//  name: 'cc4'
//})
  let p3 = tt.db.find('server', {
    name: /c3/
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
  console.log(http_conf)
  http.init(http_conf)
  
})