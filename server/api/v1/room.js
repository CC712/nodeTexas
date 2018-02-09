const express = require('express')
const router = express.Router()
const db = require('../../db')
const cache = require('../cache/cache')
const room_player_handler = require('./room_player')
var ndb = db.getDB()

/*
 * DB 维护room 不符合内存储存的设计 矛盾了
 * */

//sub control
// 需要用roomid  传 room 对象给 model? 还是req. 都可以取到的
router.use('/:roomid/player', (req, res, next) => {
  let roomid = req.params.roomid
  req.room = cache.getRoomById(roomid)
  console.log('% cache room get %')
  next()
}, room_player_handler)
//main
router.get('/', function(req, res, next) {
  var ndb = db.getDB()
  var id = req.params.id
  console.log('*room*   GET without ID')

  res.send({
    code: 1,
    msg: 'here should be return all rooms',
    data: cache.getRoomById()
  })

})
// INIT
router.post('/:roomid/init', function(req, res, next) {
  console.log('*room*  init room model')
  let roomid = req.params.roomid
  req.room = cache.getRoomById(roomid)
  req.room.model.init()
  res.send({
    code: 1,
    msg: 'model init ',
    data: req.room.model
  })

})
// START
router.post('/:roomid/start', function(req, res, next) {
  console.log('*room*  game start')
  let roomid = req.params.roomid
  req.room = cache.getRoomById(roomid)
  var err = req.room.model.start()
  if(! err){
  res.send({
    code: 1,
    msg: 'model start',
    data: req.room.model
  })
  } else {
  	res.send({
  		code : 0,
  		msg : err
  	})
  }

})
//search room
router.get('/:id', function(req, res, next) {

  var id = req.params.id
  console.log('*room*   GET', id)

  res.send({
    code: 1,
    msg: `return rooms' data`,
    data: cache.getRoomById(id)
  })

})
//create
router.post('/', function(req, res, next) {
  //确定没有才创建 
  // 需要有一个不会重复的id
  // 用时间戳，如果同一时间很多的话，就递增 递增也需要总数的啊。。
  //room id = [time stamp] +  1-3位 随机数字
  // 其实还是有可能重复的。。
  var new_id = () => new Date().now + String(~~(Math.random() * 1000))
  var rid = new_id()
  var __template = {
    id: rid,
    players: [],
    banker: {},
    model: {},
    _CREATE_DATE: new Date(),
    _GAMING: false
  }
  var n = cache.createRoom()
  res.send({
    code: 200,
    msg: ' create new room success',
    data: n
  })
})



module.exports = router