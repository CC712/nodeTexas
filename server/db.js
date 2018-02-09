const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const log = require('./log')
const db_config = require('./config').db_config
// 封装 db 与 Log
// 发起一次新的连接，大概是这么个意思
DB = function(conf, cb = () => {}) {
  if(conf.db_name == undefined || conf.db_ip == undefined || conf.db_port == undefined) {
    this.log('db config error')
    return
  }
  var url = "mongodb://" + conf.db_ip + ":" + conf.db_port + "/" + conf.db_name
  console.log('url :' + url)

  // connect to mongod
  // 每一次建立连接都是一个新的 instance
  MongoClient.connect(url, (err, client) => {
    if(err) {
      this.log('CONNECT:connect ' + 'url :' + url + ' failded!')
      db.close()
    } else {
      this.client = client
      this.db = client.db(conf.db_name)
      cb(this.db)
      this.log('CONNECT:connect mongod ' + conf.db_name + '  url :' + url + ' succes !')
    }
  })
}

DB.prototype.insert = function(colname, doc, options = {}, callback = {}) {
  return this.db.collection(colname).insertOne(doc, options).then((r) => {
    this.log('INSERT :' + JSON.stringify(doc) + r)
    return r
  }).catch(err => this.log(err))
}

DB.prototype.find = function(colname, query, options = {}, callback = () => {}) {
  return this.db.collection(colname).find(query, options).toArray().then((r) => {
    this.log('FIND : ' + JSON.stringify(r))
    return r
  }).catch(err => this.log(err))
}
DB.prototype.update = function(colname, filter, update, options = {}, callback = () => {}) {
  return this.db.collection(colname).findOneAndUpdate(filter, update, options).then(r => {
    this.log('UPDATE ： ' + JSON.stringify(r))
    return r
  }).catch(err => this.log(err))
}
DB.prototype.delete = function(colname, filter, options = {}, callback = () => {}) {
  return this.db.collection(colname).deleteOne(filter, options).then(r => {
    this.log('DELETE ： ' + JSON.stringify(r))
    return r
  }).catch(err => this.log(err))
}
DB.prototype.close = function() {
  return this.mc.close().then(r => {
    this.log('db close')
  }).catch(err => this.log(err))
}
DB.prototype.log = function(txt, is_mute = false) {
  let info = log(txt)
  !is_mute && console.log(info)
  this.db && this.db.collection('log').insertOne(info)
}
var yourDB
exports.createDB = function createDB() {
  yourDB = new DB(db_config)
  console.log(144, new Date())
}
exports.getDB = function getDB() {
  return yourDB
}
//增加表
function createCollection(db, name) {
  db.createCollection(name)
}