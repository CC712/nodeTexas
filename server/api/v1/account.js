//router get
const express = require('express')
const router = express.Router()
const db = require('../../db')
// crud post get put delete
//get 为例 
var a = {
  name: 'route scope',
  time: new Date(),
  db: db,
  getdb: db.getDB()
}
//verify auth
router.use(function(req, res, next){
	  var isLogin = req.cookies.isLogin
	 if(isLogin){
	 	next()
	 }
  else res.send({
  	code:402,
  	msg:'need login auth'
  })
})
router.get('/:uid', function(req, res, next) {
  console.log('QUERY:', req.query)
  var uid = req.params.uid || 0
  uid = Number(uid)
  ndb = db.getDB()
  ndb.find('player', {
    'uid': uid
  }, {
    limit: 5
  }).then(r => {
    console.log('#find result#', r)
    if(r[0] == undefined) {
      res.send({
        code: 0,
        msg: 'no valid account'
      })
    } else {
      res.send({
        code: 1,
        msg: 'get valid account',
        data: r
      })
    }
  })

})

router.post('/', function(req, res, next) {
  console.log(req.body)
  var uid = Number(req.body.uid)
  ndb = db.getDB()
  ndb.insert('player', {
    uid: uid,
    name: 'name_' + uid,
    chip: ~~(Math.random() * 10000)
  }).then(r => {
    res.send({
      success: true,
      msg: 'post',
      data: r
    })
  })
})

// 根据 chip 来修改 account 的chip值 密码呢？ 存在哪里？
router.patch('/', function(req, res, next) {
  var uid = Number(req.body.uid || 0),
    chip = Number(req.body.chip || 0)
    
    
    
  ndb = db.getDB()
  ndb.update('player', {
    uid: uid
  }, {
    $inc: {
      'chip': chip
    }
  }).then(r => {
    res.send({
      code: 1,
      msg: 'patch success!',
      data: r
    })
  })
})
router.delete('/', function(req, res, next) {
  var uid = req.body.uid || 0
  uid = Number(uid)
  ndb = db.getDB()
  ndb.delete('player', {
    uid: uid,
  }).then(r => {
    res.send({
      success: true,
      msg: 'delete',
      data: JSON.stringify(r)
    })
  })
})
//player data modify
module.exports = router