import ajax from '../ajax'
import sceneCache from './scene_view/all'
import msgCenter from './msgCenter'
/* util */
var $ = (f, s = document) => s.querySelector(f)
msgCenter.makeMc()
var mc = msgCenter.getMc()
/************************************/
//State Machine
//dependency reverse for scenes
var Game = function() {
  this.scene = sceneCache.s_login
	//self player info
	this.uid = undefined
  this.isLogin = false
  /*
   * Should model be exposed ?
   * Or just expose control
   */

  this.init()
}
Game.prototype.init = function() {
  console.log(this)
  var that = this
  //preload i dont think code like this is reasonable
  mc.regist('sceneSwitch', function(sname) {
    console.log('using ', sname, sceneCache[sname])
    that.switchTo(sceneCache[sname])
  })
  //regist enterRoom
  mc.regist('enterRoom', function(id) {
    console.log('enterRoom ', id, that.uid)
    ajax({
      url: __host + '/api/v1/room/' + id
    }).then(r => {
      if(r.data) {
        var data = r.data
        console.log('enterroom ajax', r, r.data)
        //  insert or not 
        if(data.state == 0){
        	//add player
        	that.scene.control.addPlayer(that.uid)
        }
        
        // add client uid and room id to local model
        that.scene.model._uid = that.uid
        that.scene.model._roomid = id
        that.scene.model._isGaming = false
        
        console.log('enter room and add uid', that.scene.model)
       that.scene.model.init(data.model)
			 
      }
      console.log('get room by id', r)
    }).catch(err => console.log(err))
  })
  //regist pressStart
  mc.regist('pressStart', function() {
    that.scene.control.startBtnHandler(that.uid)
  })
  //get uid and store
  mc.regist('login', function(uid) {
    that.uid = uid
    that.isLogin = true
  })
  mc.regist('back', function() {
    that.backToLast()
  })
  // init all scene
  for(let i in sceneCache) {
    sceneCache[i].init()
  }
}
Game.prototype.switchTo = function(scene_obj, args) {
  this.scene = scene_obj
  console.log(Array.from(arguments), this, 'use')
  this.scene.use(args)
}
Game.prototype.backToLast = function() {
  console.log('now', this.scene)
  this.scene.close()
  this.scene = this.scene.lastScene
  this.scene.use()
  console.log('receive', this.scene)
}
var _game = new Game()

var __host = `//139.199.188.25:8000`
var isLogin = false
//
//var autoLogin = function() {
//ajax({
//  url: __host + '/api/v1/login'
//}).then(r => {
//  //  console.log('try login auto ', r)s
//  if(r.success == true) {
//    islogin = true
//  }
//  if(isLogin) {
//    _game.switchTo(s_hall)
//  }
//})
//}
