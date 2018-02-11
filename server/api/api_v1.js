const express = require('express')
const router = express.Router()
//game part
const cache = require('./cache/cache')
//handlers
const account_handler = require('./v1/account')
const login_handler = require('./v1/login')
const signUp_handler = require('./v1/signup')
const room_handler = require('./v1/room')
// 导流 index的作用
var ApiHandler = function (){
	
//demo

	router.use('/account', account_handler)
	router.use('/signUp',signUp_handler)
	router.use('/login', login_handler)
	router.use('/room', room_handler)
	
	return router
}
module.exports = ApiHandler
