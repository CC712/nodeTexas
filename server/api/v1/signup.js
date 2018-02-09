//router get
const express = require('express')
const router = express.Router()
const db = require('../../db')
const jwt = require('jsonwebtoken')
//verify user by jwt
// 账号注册
router.post('/', function(req, res, next) {
  console.log('**built token**', req.body)
  
  var uid = Number(req.body.uid),
    	pwd = String(req.body.pwd)
		
  var ndb = db.getDB()
  console.log('$$$$$$$4conflict', uid, pwd)
  // comflict uid
  ndb.find('player', {
    uid: uid
  }, {
    limit: 2
  }).then(r => {
    if(r[0] == undefined) return new error('uid avaliable')
    res.send({
      code: 0,
      msg: "account conflict"
    })
  }).catch(r => {

    ndb.insert('player', {
      uid: uid,
      pwd: pwd
    })
    //jwt 储存为cookie ？
    //res.cookie("token", token, {domain: 'localhost'})
    //res.cookie('isLogin', true, {domain : 'localhost',
    //maxAge : 60
    //})
    // 注册后需要手动登录， 合理化cookie逻辑

    res.send({
      code: 1,
      msg: 'register successful， PLZ login!'
    })

  })

})
module.exports = router