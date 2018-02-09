const assert = require('assert')
//router get
const express = require('express')
const router = express.Router()
const db = require('../../db')
const jwt = require('jsonwebtoken')
//verify user by jwt

//token 登录 维持状态 
router.get('/', function(req, res, next) {
  console.log('auto login by token')
  let token = req.cookies ? req.cookies.token : ''
  token = token || req.query.token
  if(!token) {
    res.send({
    	code:402,
      success: false,
      msg: 'no token'
    })
    return
  }
  //jwt 验证
  try {
    var decoded = jwt.verify(token, 'ThisIsSecret'),
      uid = String(decoded.uid)
  } catch(err) {
    res.send({
    	code:402,
      msg: 'invalid token ,please relogin!'
    })
    return
  }
  console.log('token value', decoded)
  var ndb = db.getDB()
  ndb.find('player', {
    uid: uid
  }).then(r => {
    if(r.length == 1) r = r[0]
    res.send({
    	code:200,
      msg: 'successful verification!',
      uid: uid,
      lastLogin: r.lastLogin
    })

  })

})
//主动登录 首次
router.post('/', function(req, res, next) {
  console.log('**built token**', req.body)
  var ndb = db.getDB()
  var uid = Number(req.body.uid),
    pwd = String(req.body.pwd)
    // 签发的token 应该有一定的持续时间
		// 登录的时候应该是 无限期
    // 退出或者关闭浏览器的时候应该给一个期限
  var new_token = jwt.sign({
    uid: uid,
    pwd: pwd
  }, 'ThisIsSecret')

  // 登录		
  ndb.update('player', {
    uid: uid,
    pwd: pwd
  }, {
    $set: {
      token: new_token,
      lastLogin: new Date()
    }
  }).then(r => {
    if(!r.value) {
      res.send({
        code: 402,
        msg: 'invalid uid or password!'
      })
      return
    }
    //jwt 储存为cookie  
    // 主动登录应刷新 client 的token expires and maxAge
    // 跨域不能设置cookie 
    //前端的Domain 和后端的Host 不一致的时候就不可以吗？
    let domain = 'localhost'//req.domain
    console.log('req domain',req.domain)
    res.cookie("token", new_token, {
      path: '/'
    })
    res.cookie('isLogin', true, {
      path: '/'
    })
    res.send({
      code: 200,
      msg: 'valid auth! login success!',
      token: new_token
    })
  })
})
module.exports = router