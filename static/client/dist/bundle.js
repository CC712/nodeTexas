/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function ajax(options = {
  method,
  url,
  data,
  success,
  failure
}) {
  let opt = options || {}
  if(!opt) return false
  opt.method = opt.method || 'GET'
  
  opt.method = opt.method.toUpperCase() || 'GET';
  opt.url = opt.url || '';
  opt.async = opt.async || true;
  opt.data = opt.data || {};
  opt.success = opt.success || function() {};
  // promise 化  时髦一点。。
  return new Promise((resolve, reject)=>{
  	var xhr = null
  
  // 兼容 ie
  if(XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    xhr = new ActiveXObject('Microsoft.XHLHTTP')
  }
  	// **重要** json 格式
  	xhr.responseType = 'json'
  	// CORS
//	xhr.withCredentials = true
  var params = []
  for(let key in opt.data) {
    params.push(`${key}=${opt.data[key]}`)
  }
  var postData = params.join('&')
  if(opt.method === 'GET') {
  	if(params.length > 0)
    xhr.open(opt.method, opt.url + '?' + postData, opt.async);
    else {
    xhr.open(opt.method, opt.url, opt.async);
    	
    }
    xhr.send();
  } else {
    // put delete post
    xhr.open(opt.method, opt.url, opt.async);
    xhr.setRequestHeader("Content-Type", 'application/json;charset=utf-8');
    xhr.send(JSON.stringify(opt.data)); //string
  }
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
    	// response 和 responstxt差别巨大 一个是json 一个是文本
      resolve(xhr.response , xhr);
    } else if(xhr.readyState == 4 && xhr.status !== 200) {
      reject(xhr.response, xhr)
    }
  }
  })
  
}
/* harmony default export */ __webpack_exports__["a"] = (ajax);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var MsgCenter = function(){
	this.pool = {}
	// in control
	this.regist = (key, fn)=>{
		this.pool[key] ? this.pool.push(fn): this.pool[key] = [fn];
	}
	// in view
	this.notify = (key, args = []) => {
		this.pool[key] && this.pool[key].forEach(f => f(...args))
	}
}
var mc = null
function makeMc (){
	if(mc) return new Error('mc already exists')

	mc = new MsgCenter()
}
function getMc (){
	return mc ? mc : new Error('do not exist mc')
}
/* harmony default export */ __webpack_exports__["a"] = ({
	makeMc,
	getMc
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__poker__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__player__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__10ChangeAlgorithem__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__valid__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__testHands__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scene__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ajax__ = __webpack_require__(0);







var Texas = (function() {
  //封装
  //游戏主函数
  function Texas() {
    //polling 轮训
    this.roomid = String('000000')

    this.polling = null

    //卡池
    this.cardPool = []
    //玩家
    this.players = []
    //NPC
    this.banker = new __WEBPACK_IMPORTED_MODULE_1__player__["a" /* default */]('Banker', this)
    this.banker.chip = 0
    this.banker.chippool = 0
    //观察者模式的池
    this.obsPool = {}
    //  
    this.state = 'start'
    this.stateMap = {}
    //session 
    this.aBlindChip = 4
    this.btn = 0
    //position 
    this.pos = undefined
    //obs
  }

  Texas.prototype.init = function(data) {
    //state machine init 
    //localization
    for(let i in data.model) {
      this[i] = data.model[i] 
    }
    //call rendering
    this.notifyObs('player')
    this.notifyObs('banker')
    this.notifyObs('ask')
    this.notifyObs('start-btn', this.uid)
  }
  // 可以用策略模式精简一下才对 先放着 先实现先
  Texas.prototype.regObs = function(type, fn) {
    if(!Array.isArray(this.obsPool[type])) {
      this.obsPool[type] = []
    }
    this.obsPool[type].push(fn)
  }
  Texas.prototype.notifyObs = function(type, args = []) {
//  console.log('model notify args', type, args)
    this.obsPool[type].forEach(f => f(...args))
  }

return new Texas()
})()
/* harmony default export */ __webpack_exports__["a"] = (Texas);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
  function Poker(key) {
    this.key = key
    this.cardFace = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']
    this.typeFace = ['♠', '♥', '♣', '♦']
    this.val = Number.parseInt(this.key / 4)
    this.type = this.key % 4
    return {
      cardFace: `${this.typeFace[this.type]} ${this.cardFace[this.val]}`,
      key: this.key,
      type:this.type,
      val:this.val
    }
  }
//class Poker {
//	constructor(key) {
//	this.key = key
//  this.cardFace = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']
//  this.typeFace = ['♠', '♥', '♣', '♦']
//  this.val = Number.parseInt(this.key / 4)
//  this.type = this.key % 4
//  this.new()
//	}
//	static new(key) {
//		return this(key)
//	}
//}
  /* harmony default export */ __webpack_exports__["a"] = (Poker);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*  不重复的 m 个元素 选 n 个 
*	[a,b,c] 选 2    以数组对应的下标  的值作为 是否选择的标记   [1,0,1] => ac
*	110000  => 101000 => 100100 => 100010 => 100001
*	可见规律，寻找第一个 10 然后交换成 01    就是1向右移动 移到头 然后移第二个
*	
*/	
function arange (arr=['A','B','C'],num=2){
	let s = []
	let re = []
	
	
	
	
	for(let i =0;i<arr.length-num+1;i++){
		//移动首位
		for(let sl = 0;sl<arr.length;sl++){
		if(sl<num+i && sl>=i) s[sl]=1
		else s[sl]=0
		}
	re.push(s.join(''))
		for(let k =i+1;k<arr.length;k++){
			//查找 10
			if(s[k]==0 && s[k -1] ==1){
				//交换
				let t = s[k]
				s[k] = s[k-1]
				s[k - 1] = t
					re.push(s.join(''))
			} 
				
		}
			if(s[i]==0 && s[i -1] ==1){
				//交换
				let t = s[i]
				s[i] = s[i-1]
				s[i - 1] = t
					re.push(s.join(''))
			} 
	}
	return re.reduce((o,str)=>{
		//console.log(str)
		o.push(arr.filter((x,i)=>{
			//console.log(str.slice(i,i+1))
			return str.slice(i,i+1)!= 0}))
			return o
	},[])
}
/* unused harmony default export */ var _unused_webpack_default_export = (arange);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__view__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ajax__ = __webpack_require__(0);


function Controllor(model) {

  this.model = model
  this.view = new __WEBPACK_IMPORTED_MODULE_0__view__["a" /* default */](this.model, this)
  this.polling = null
}
Controllor.prototype.getData = function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__ajax__["a" /* default */])({
    url: '//localhost:8080/api/v1/room/' + this.model.roomid
  }).then(r => {
    //      console.log('polling data get!', r.data.model)
    if(!r.data){
    	return new Error('get room false')
    }
    return r.data
  }).catch(err => {
    console.log('this is a err', err)
  })

}
Controllor.prototype.valid = function(ip) {
  if(ip) {
    this.model.validHand(ip)
    return
  }
  this.model.players.forEach(p => console.log(this.model.validHand(p)))
}
Controllor.prototype.init = function(data) {
  //this.model.init()
  if(!this.polling) {
    this.polling = setInterval(() => {
      this.getData().then(data => {
        this.model.init(data)
      })

    }, 5000)
  }
  if(data) this.model.init(data)
  let playerPart = this.view.el
  playerPart.querySelector('.stage-startBtn').addEventListener('click', () => {
    this.start()
  })
  playerPart.querySelectorAll('.stage-select button').forEach(x => x.addEventListener('click', (e) => {
    this.btnsHandler(e)
  }))
  console.log('init')
}
//start
Controllor.prototype.start = function() {
  this.model.close()
  this.model.init()
  //view init
  this.view.init()
  this.view.renderChipField()

}
Controllor.prototype.startBtnHandler = function(uid) {
  var m = this.model
  var p = this.model.players.find(p => p.uid == uid)
  console.log('btn handler start btn', uid, p)
  //validate
  var errEvents = {
    '001': function() {
      alert('人数不足')
      return
    },
    '002': function() {
      alert('有人没有准备')
      return
    },
  }
  //exception handler
  var canStart = function() {
    if(!m.players.every(p => p.isReady == true || p.isHost == true))
      return '002'
    if(m.players.length < 2)
      return '001'
  }

  var st = p.state
  if(p.isHost) {
    var errCode = canStart()
    if(errCode) {
      return errEvents[errCode]()
    }
    Object(__WEBPACK_IMPORTED_MODULE_1__ajax__["a" /* default */])({
      url: `//localhost:8080/api/v1/room/${this.model.roomid}/start`,
      method: 'post'
    }).then(r => {
        r.data && this.model.init(r.data)
    }).catch(err => {
      alert(err)
    })
  } else {
  	alert(`player ready => ${p.isReady}`)
    Object(__WEBPACK_IMPORTED_MODULE_1__ajax__["a" /* default */])({
      url: `//localhost:8080/api/v1/room/${this.model.roomid}/player/${uid}/ready`,
      method: 'post'
    }).then(r => {
    	console.log(r)
        r.data && this.model.init(r.data)
    })
  }

}
Controllor.prototype.back = function() {

}
Controllor.prototype.btnsHandler = function(e) {
  let target = e.target
  let method = target.getAttribute('data-btn')
  Object(__WEBPACK_IMPORTED_MODULE_1__ajax__["a" /* default */])({
    url: `//localhost:8080/api/v1/room/${this.model.roomid}/player/${this.model._uid}/${method}`,
    method: 'post'
  })
 	this.view.renderAsk(true)
}
//handler
Controllor.prototype.addPlayer = function(uid) {
  Object(__WEBPACK_IMPORTED_MODULE_1__ajax__["a" /* default */])({
    url: `//localhost:8080/api/v1/room/${this.model.roomid}/player/${uid}`,
    method: 'post'
  }).catch(err => {
    console.log('this is a err', err)
  })
}
Controllor.prototype.delPlayer = function(uid) {
  Object(__WEBPACK_IMPORTED_MODULE_1__ajax__["a" /* default */])({
    url: `//localhost:8080/api/v1/room/${this.model.roomid}/player/${uid}`,
    method: 'delete'
  }).catch(err => {
    console.log('this is a err', err)
  })
}
Controllor.prototype.close = function() {
  this.model._isGaming = false
  clearInterval(this.polling)
  console.log('exit this game and have a new model')
}

Controllor.prototype.start = function() {
  if(this.model.state == 'start') {
    Object(__WEBPACK_IMPORTED_MODULE_1__ajax__["a" /* default */])({
      url: '//localhost:8080/api/v1/room/' + this.roomid + '/start'
    }).then(r => {
      if(r.data)
        this.model.init(r.data.model)
      else return new Error(r.msg)
    }).catch(err => {
      console.log('this is a err', err)
    })
  }
}
/* harmony default export */ __webpack_exports__["a"] = (Controllor);

//组件内部可以是事件驱动

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ajax__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scene_view_all__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__msgCenter__ = __webpack_require__(1);



/* util */
var $ = (f, s = document) => s.querySelector(f)
__WEBPACK_IMPORTED_MODULE_2__msgCenter__["a" /* default */].makeMc()
var mc = __WEBPACK_IMPORTED_MODULE_2__msgCenter__["a" /* default */].getMc()
/************************************/
//State Machine
//dependency reverse for scenes
var Game = function() {
  this.scene = __WEBPACK_IMPORTED_MODULE_1__scene_view_all__["a" /* default */].s_login
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
    console.log('using ', sname, __WEBPACK_IMPORTED_MODULE_1__scene_view_all__["a" /* default */][sname])
    that.switchTo(__WEBPACK_IMPORTED_MODULE_1__scene_view_all__["a" /* default */][sname])
  })
  //regist enterRoom
  mc.regist('enterRoom', function(id) {
    console.log('enterRoom ', id, that.uid)
    Object(__WEBPACK_IMPORTED_MODULE_0__ajax__["a" /* default */])({
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
  for(let i in __WEBPACK_IMPORTED_MODULE_1__scene_view_all__["a" /* default */]) {
    __WEBPACK_IMPORTED_MODULE_1__scene_view_all__["a" /* default */][i].init()
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

var __host = `//localhost:8000`
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


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ajax__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__msgCenter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__js_texas__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__js_controllor__ = __webpack_require__(5);




//params


var __host = `//localhost:8000`
var isLogin = false
var $ = (f, s = document) => s.querySelector(f)
var sceneCache = {}
var mc = __WEBPACK_IMPORTED_MODULE_1__msgCenter__["a" /* default */].getMc()

function sceneFactory(obj) {
  let ns = obj
  sceneCache[`s_${ns.name}`] = ns
  return ns
}

function Scene({
  name,
  last,
  el,
  cb,
  fn = function() {}
}) {
  this.name = name
  this.lastScene = last
  //dom  绑定 以及 获取数据
  this.callback = cb
  this.process = fn
  this.el = el
  //add to cache
  sceneFactory(this)
}
/*
 *  init addEventListener 
 */
Scene.prototype.init = function(g) {
  //cbload all listners and dom render 
  this.callback(g)
}
Scene.prototype.close = function(re) {
  this.el.style.display = 'none'
  //how to back to game ?
}
Scene.prototype.use = function(args) {
  this.lastScene && this.lastScene.close()
  this.el.style.display = 'block'
  this.process(args)
}
Scene.prototype.backToLast = function() {
  if(this.last) {
    this.close()
    this.lastScene.use()
  return this.lastScene
  }

}
//specific scene processing
var s_login = new Scene({
  name: 'login',
  last: null,
  el: document.querySelector('.login'),
  cb: function(game) {
        mc = __WEBPACK_IMPORTED_MODULE_1__msgCenter__["a" /* default */].getMc()
    $('.back').style.display = 'none'
   
    // how a lowwer module modify a high module ?
    $('button[type = submit]', this.el).addEventListener('click', () => {
      var uid = $('#l_uid', this.el).value,
        	pwd = $('#l_pwd', this.el).value
				
      Object(__WEBPACK_IMPORTED_MODULE_0__ajax__["a" /* default */])({
        method: 'post',
        url: __host + '/api/v1/login',
        data: {
          uid: Number(uid),
          pwd: pwd
        }
      }).then(r => {
        if(r.code == 200) {
          alert('login success')
          mc.notify('login', [uid])
          console.log(mc)
          mc.notify('sceneSwitch', ['s_hall'])
          return r
        } else {
          alert(r.msg)
        }
      })
    })
    
     $('#login_signUp').addEventListener('click', ()=> {
      alert('signUp')
      mc.notify('sceneSwitch', ['s_signUp'])
    })
  },
   fn: ()=>{
   	    $('.back').style.display = 'none'
   }
})
var s_signUp = new Scene({
  name: 'signUp',
  last: s_login,
  el: document.querySelector('.signUp'),
  cb: function() {

    $("#signUp_regist").onclick = function() {
      var uid = $('#s_uid', this.el).value,
        pwd = $('#s_pwd', this.el).value,
        pwd2 = $('#s_pwd2', this.el).value

      if(!/^[a-zA-Z0-9]{6,12}$/.test(pwd)) {
        alert('密码非法 需满足 /^[a-zA-Z0-9]{6,12}$/')
        return
      }
      if(pwd !== pwd2) {
        alert('两次密码不一样')
        return
      }
      if(!/^\d{6,12}$/.test(uid)) {
        alert('账号不合格')
        return
      }

      Object(__WEBPACK_IMPORTED_MODULE_0__ajax__["a" /* default */])({
        method: 'post',
        url: __host + '/api/v1/signup',
        data: {
          uid: Number(uid),
          pwd: pwd
        }
      }).then(r => {
        if(r.code == 1) {
          alert('注册成功 返回登录界面')
        	mc = __WEBPACK_IMPORTED_MODULE_1__msgCenter__["a" /* default */].getMc()
          mc.notify('back')

        }
      })
    }

  },
  fn: function() {
		$('.back').style.display = 'block'
		$('.back').onclick = function (){
			mc.notify('back')
		}
  }
})

function simpleTextRender(
  fa,
  resource = [],
  template,
  trans = _ => _
) {
  //	//console.log('res',resource)
  resource.forEach(r => {
    
    var nr = document.createElement('div')
    fa.appendChild(nr)
    nr.innerHTML = template
    
    var d = document.querySelector('div[data-type=cache]') || document.createElement('div')
    d.setAttribute('data-type', 'cache')
    d.style.display = 'none'
    nr.appendChild(d)

    for(let i in r) {
      var k = fa.querySelector(trans(i))
      if(k) {
        k.innerText = r[i]
      } else {
        d.setAttribute(`data-${i}`, r[i])
      }
    }

  })
}

var s_hall = new Scene({
  name: 'hall',
  last: s_login,
  el: $('.hall'),
  cb: function(game) {
    $('.hall-list').innerHTML = ''

  },
  fn: function() {
    // 提前渲染
		$('.back').style.display = 'block'
		$('.back').onclick = function (){
			mc.notify('back')
		}
    //model
    var hall = {
      el: $('.hall-list'),
      isShow: false,
      rooms: []
    }
    hall.el.innerHTML = ''
    // control mix view 
    //template
    var template = `<div class="hall-room hall-room.waiting">
					<h2 class="hall-title">title default</h2>
					<p class="hall-abstract">abstract default</p>
				</div>`
    //get room data
//					<span class="hall-players">1</span>
//					<p class="hall-state">游戏中</p>

    Object(__WEBPACK_IMPORTED_MODULE_0__ajax__["a" /* default */])({
        url: __host + '/api/v1/room/'
      })
      .then(r => {
        if(r.data) {
          hall.rooms = r.data
          hall.rooms.forEach(item => {
            var nd = document.createElement('li')
            hall.el.appendChild(nd)
            simpleTextRender(nd, hall.rooms, template, function(classname) {
              return `.hall-${classname}`
            })
//          nd.querySelector('.hall-players').innerText = item.model.players.length
//          nd.querySelector('.hall-state').innerText = item.model._isGaming?'游戏中':'等待中'
            // click handler and render 
            var roomsEl = hall.el.querySelectorAll('li')
            roomsEl.forEach(r => {
              r.addEventListener('click', (e) => {
                var id = r.querySelector('[data-type=cache]').getAttribute('data-id')
                mc.notify('sceneSwitch', ['s_stage'])
                mc.notify('enterRoom', [id])
              }, false)
            })
          })

        } else {
          alert('房间不存在')
        }
      })
  }
})
/*
 * btn and dom in the scene object
 * object Game maintain all scenes 
 * Game also maintain an object called model 
 * this model is represented the Texas model 
 * got from backEnd.
 * 
 * To seperate dom and model, use the midiator mode
 * 
 */
var s_stage = new Scene({
  name: 'stage',
  last: s_hall,
  el: document.querySelector('.stage'),
  cb: function() {
    //会多次绑定 是
    document.querySelector('.stage-startBtn').addEventListener('click', function() {
      //
      //console.log('click start btn')
      //分情况 Game 维护了uid 信息 最顶层 notify 通信
      mc.notify('pressStart')
    })
		$('.back').addEventListener ('click', function stageBack(){
			if(this.model._isGaming) return
			
		})
  },
  fn: function(data) {
    this.model = __WEBPACK_IMPORTED_MODULE_2__js_texas__["a" /* default */]
    this.control = new __WEBPACK_IMPORTED_MODULE_3__js_controllor__["a" /* default */](this.model)
    this.control.init(data)
  }
})
/* harmony default export */ __webpack_exports__["a"] = (sceneCache);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Player(name,model) {
  this.el = null
  this.hand = []
  this.chip = 1000
  this.outChip = 0
  this.name = name
  this.model = model
  // 0 moved 1 willmove 2 dead 3 watching
  this.state = 3
}
Player.prototype = {
  init: function() {
    this.hand = []
    this.outChip = 0
  },
  // 这个是外挂接口
  changeChip: function(val) {
    this.chip += val
    this.state = 0
  	this.model.notifyObs('player',this)
  },
  addHand: function(number) {
  	let pool = this.model.cardPool
  	for(;number >0;number--){
  		let poker = pool.splice(Math.floor(Math.random()*pool.length),1)[0]
    this.hand.push(poker)
   }
//	this.model.notifyPlayersObs(this)
  	this.model.notifyObs('player',this)
  },
}
/* harmony default export */ __webpack_exports__["a"] = (Player);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__10ChangeAlgorithem__ = __webpack_require__(4);

function valid(player) {
      // 所有的判定方法均返回一个数组 [ [具体对象]，[可能性2]]
      let hand = player.hand.concat(this.banker.hand)
      hand.sort((a, b) => a.key - b.key)
      //顺子
      var isStraight = (hand) => {
        //选五张,3组 1234567 1123456 1112345
        let iValue = hand.map(x=>x.val)
        let re = []
        //dp find submission
        let s = []
        for(let i = 0; i < hand.length;i++){
        	let k = i
        	s= [hand[i]]
        	for(;k<hand.length;k++){
        		if(hand[k].val == s[s.length -1].val +1)
        		s.push(hand[k])
        	}
        	if(s.length > 4){
        		re.push(s.slice(0,5))
        		
        	}else if(s.length == 4 && ('dasdasd',s[3].val == 12 && iValue.indexOf(0) != -1)){
        		re.push(s.concat(hand.filter(x=>x.val==0)[0]))
        	}
        }
        return re.length>0 ? re[0]:false
      }
      //两对 
      var isTwoPair = (hand) => {
        //选对子
        let iValue = hand.map(x=>x.val)
        hand.sort((a, b) => a.key - b.key)
        let re = []
        let pairs = iValue.filter((x, i) => iValue.indexOf(x) !== iValue.lastIndexOf(x))
        pairs = [...new Set(pairs)]
        //如果两对以上，就是三对了
        if(pairs.length == 2) {
        	re = hand.slice(0).filter(x=>{
        		let f = false
        		pairs.forEach(v=>{
        			f = v !== x.val? f : true
        		})
        		return f
        	})
          //选择剩下的最大牌
          let rest =  hand.slice(0).filter(x=>{
        		let f = false
        		pairs.forEach(v=>{
        			f = v !== x.val? f : true
        		})
        		return !f
        }).sort((a,b)=>a.key - b.key).slice(0,1)
        re = re.concat(rest)
        }
        return re.length > 0  ? re : false
      }
      //三条
      var isThreeKind =(hand)=>{
      	let iValue = hand.map(x=>x.val)
        let re = [],rest=[]
        let tk= iValue.filter((x, i) => {
        	return iValue.indexOf(x) == iValue.lastIndexOf(x) -2
        }).slice(0,3)
        let tkVal = tk[0]
        //只要最大的
        re = hand.reduce((o, n)=>{
        	n.val == tkVal ?o.push(n):rest.push(n)
        	return o 
        },[])
        re = re.concat(rest.slice(0,2))
        return re[4] ? re : false
      }
      //葫芦
      var isHuLu = (hand) => {
      	if(isThreeKind(hand)){
      		let iv = hand.map(x=>x.val)
      		let p3 = iv.filter(x=>iv.indexOf(x) == iv.lastIndexOf(x)-2).slice(0,3)
      		let p2 = iv.filter(x=>x != p3[0])
      		let k = p2.filter((x,i)=>p2.indexOf(x) != p2.lastIndexOf(x)).sort().slice(0,2)
      			p2 = p2.filter(x=>x==k[0])
						p3 = p3.concat(k)
      			return p3[4] ? hand.filter(x => p3.indexOf(x.val) != -1).slice(0,5) : false  
      	}
      		return false
      }
      //同花
      var isFlush = (hand) => {
        //选择花色 遍历 
        let type = 0,
          re
        while((re = hand.filter(x => x.type == type)).length < 5) {
          type++
          if(type > 4) return false
        }
        return re.slice(0,5)
        //返回同花的数组 最大的一组就行了

      }
      //同花顺
      var isSF = (hand) => {
      	if(isFlush(hand) && isStraight(hand)){
      		//get Flush part 
      		  let type = 0,
          re
        while((re = hand.filter(x => x.type == type)).length < 5) {
          type++
          if(type > 4) return false
        }
        //get straight part
        return isStraight(re)
      	}
      	return false
      }
      //四条 炸弹 hand 是数组>对象s
      var isFour = (hand) => {
        let iValue = hand.map(x => x.val)
        let s = hand.filter((x, i) => iValue.indexOf(x.val) - iValue.lastIndexOf(x.val) <= -3)
        if(s.length >= 4) {
          let one = hand.filter(x => s.indexOf(x) == -1)[0]
          s.slice(0,4).push(one)
//         console.log(s.slice(0,4),one)
           return s
        } else {
          return false
        }
      }
      //一对
      var isOnePair = (hand) => {
        let iValue = hand.map(x => x.val)
        let s = iValue.filter(x => iValue.indexOf(x) < 0)
        let re = []
        let pair = iValue.filter((x, i) =>iValue.indexOf(x) != iValue.lastIndexOf(x)  )
        let res = iValue.filter(x=>pair.indexOf(x) == -1)
        if(pair.length>0){
        	re = pair.concat(res.slice(0,3))
        	return hand.filter(x=>re.indexOf(x.val) >=0)
        }
        return false
      }
      //高牌
      var isNormal = (hand) => {
      	let iv = hand.map(x=>x.val)
       return hand.filter(x=>iv.indexOf(x.val) == iv.lastIndexOf(x.val)).slice(0,5)
      }
      
      //判断层级
		let methods = [isSF,isFour,isFlush,isStraight,isHuLu,isThreeKind,isTwoPair,isOnePair,isNormal]
		let translate2cn = ['同花顺','四张','同花','顺子','葫芦','三张','两对','一对','高牌']
		let i = 0, ans = false
		while(i<methods.length && !ans){
			let m = methods[i]
			
			if(m(hand)) ans = [m(hand),i,translate2cn[i]]
//			console.log(m.name,'==>',ans)
			i++
		}
		return ans
    }

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__poker__ = __webpack_require__(3);

var makehands = (seed)=>{
	let i = seed,re = []
	// i > 0  i <= 12
	//straight
	
	let randKey = k => 4 * k + ~~(Math.random()*4)
	/*
	for(let t = 0;t<7;t++){
		re.push(new Poker(randKey(i++)))
	}*/
	//2 pairs
	while(re.length<7){
		let t=0;
		let pl = [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,]
		pl.forEach(x=>{
			re.push(new __WEBPACK_IMPORTED_MODULE_0__poker__["a" /* default */](randKey(x)))
		})
	}
	
	//random
	/*let t=0;
		let rval = ()=>~~(Math.random()*13)
	while(re.length<7){
			re.push(new Poker(randKey(12-re.length)))
	}*/
	return re 
}
/* unused harmony default export */ var _unused_webpack_default_export = (makehands);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class scene {
  constructor(model) {
    this.model = model
  }
  switchScene(s) {
    this.model.state = s
  }
  //interface 
  doing() {}
  goNext() {

  }
};
class scene_start extends scene {
  constructor(model) {
    super(model)
  }
  doing() {
    var that = this.model
    //发公牌
    that.banker.addHand(3)
    that.players.forEach(p => {
      p.addHand(2)
      p.state = 1
    })
    //盲注
    that.btn = ~~(Math.random() * that.players.length)
    that.plusPos(1)
    that.players[that.pos].state = 0
    that.dropChip(that.players[that.pos], 2)
    that.plusPos(1)
    that.players[that.pos].state = 0
    that.dropChip(that.players[that.pos], 4)
    //console.log('btn:', that.btn, that.pos)
    // update means next one or next situation
    that.plusPos(1)
    that.notifyObs('ask',that.players[that.pos])
    this.switchScene('turn')
  }
};
class scene_turn extends scene {
  constructor(model) {
    super(model)
  }
  doing() {
    var that = this.model
    //aliveplayers not enough
    let alivePlayers = that.players.filter(p => p.state == 1 || p.state == 0)
    //console.log('alivenum', alivePlayers.length)
    if(alivePlayers.length == 1) {
      alivePlayers[0].state = 0
      this.switchScene('end')
      that.update()
      return
    }
    //2 at less alive 
    let lastp = that.pos
    while(that.players[that.pos].state != 1) {
      that.plusPos(1)
      if(that.pos == lastp) {
        console.log('can go to deal', lastp, that.pos)
        this.switchScene('deal')
        that.update()
        return
      }
    }
    let p = that.players[that.pos]
    that.notifyObs('ask', p, 1)
    p.state = 0
  }
};
class scene_deal extends scene {
  constructor(model) {
    super(model)
  }
  doing() {
    var that = this.model
    that.dealToBank()
    if(that.banker.hand.length == 5) {
      // hide ask
      that.notifyObs('ask', that.players[that.btn], false)
      //next state
      this.switchScene('end')
      that.update()
      return
    }

    //deal 之后的 应该是 在 小盲的位置上  故 pos ++
    that.plusPos(1)
    that.players.forEach(p => {
      if(p.state == 0) p.state = 1
    })
    that.notifyObs('ask', that.players[that.pos	])
    this.switchScene('turn')
		
  }
};
class scene_end extends scene {
  constructor(model) {
    super(model)
  }
  doing() {
    var that = this.model
    console.log('hello end')
    // hide ask
    that.notifyObs('ask', that.players[that.btn], false)

    //winner
    let alivePlayers = that.players.filter(p => p.state == 0)
    let winner = alivePlayers[0]
    alivePlayers.forEach(p => {
      winner = p.pokerVal[1] < winner.pokerVal[1] ? p : winner
    })
    console.log(winner.name, '<==winner', winner.hand)
    //getchip 
    winner.changeChip(that.banker.chippool)
    //animate
    that.notifyObs('getChip', winner)
    this.switchScene('start')
  }
};
/* unused harmony default export */ var _unused_webpack_default_export = ({
	scene_start,
	scene_end,
	scene_turn,
	scene_deal
});


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function view(model, controllor) {
  this.model = model
  this.Controllor = controllor
  this.el = document.querySelector('.stage')
  this.table = document.querySelector('.stage-table')
  this.playerTemplate = `<div class="player">
  		<p class = 'self'>You</p>
			<p class='name'></p><p>剩余筹码:<span	 class='chip'></span></p>
			<p>下注筹码:<span	 class='outChip'></span></p>
			<div class='pokers'></div>	
			<p>当前牌型:<span	 class='poker-value'></span></p>	
			</div>`
  this.bankerTemplate = `
			<p class='name'>庄家</p><p>池底:<span	 class='chippool'></span></p>
			<p>当前底注:<span	 class='chip'></span></p>	
			<div class='pokers'></div>	
			`
  this.askTemplate = document.querySelector('.stage-askBlock')
  //regist obs
  this.model.regObs('banker', this.renderBanker.bind(this))
  this.model.regObs('player', this.renderAll.bind(this))
  this.model.regObs('ask', this.renderAsk.bind(this))
  this.model.regObs('dropChip', this.dropChipAnimate.bind(this))
  this.model.regObs('getChip', this.getChipAnimate.bind(this))
  this.model.regObs('start-btn', this.renderStartBtn.bind(this))
}
view.prototype = {
  init: function() {
    this.table.innerHTML = ''
    console.log('chip init')
  },
  renderBanker: function() {
    let obj = this.model.banker
    let dom = document.querySelector('.stage-banker')
    dom.innerHTML = this.bankerTemplate
    dom.querySelector('.name').innerText = obj.name
    dom.querySelector('.chippool').innerText = obj.chippool
    dom.querySelector('.chip').innerText = obj.chip
    if(this.model.state !== 'start') {
      obj.hand.sort((a, b) => a.key - b.key)
      obj.hand.forEach((p) => {
        let card = document.createElement('span')
        card.setAttribute('class', `poker-${p.type}`)
        card.innerText = `${p.cardFace}`
        dom.querySelector('.pokers').appendChild(card)
      })
    }
  },
  renderOne: function(player) {
    var dom = document.querySelector(`[data-uid=uid${player.uid}]`) || document.createElement('div')
    //  console.log('renderOne:', player)
    dom.innerHTML = this.playerTemplate
    dom.setAttribute('data-uid', 'uid' + player.uid)
    // host
    if(player.isHost)
      dom.setAttribute('data-role', 'host')
    else dom.setAttribute('data-role', 'guest')
    dom.setAttribute('data-ready', player.isReady && this.model._isGaming == false)

    dom.querySelector('.name').innerText = player.name || `u${player.uid}`
    dom.querySelector('.chip').innerText = player.chip
    dom.querySelector('.outChip').innerText = player.outChip
    // 		dom.querySelector('.poker-value').innerText = player.pokerValue[2] + '=》' + player.pokerValue[1]
    // render poker
    player.hand.forEach(p => {
      let card = document.createElement('span')
      card.setAttribute('class', `poker-${p.type}`)
      card.innerText = `${p.cardFace}`
      dom.querySelector('.pokers').appendChild(card)
    })
    //self 
    if(player.uid == this.model._uid) {
      dom.querySelector('.self').setAttribute('data-hide', false)
    } else {
      dom.querySelector('.self').setAttribute('data-hide', true)
    }
    //current player 
    var cur_player = this.model.players[this.model.pos]
    //player uid not exists 
    if(cur_player) {
      console.log('cur player', cur_player.uid, player.uid)
      if(player.uid == cur_player.uid) {
        dom.setAttribute('data-cur', true)
      } else {
        dom.setAttribute('data-cur', false)
      }
    }
    //player
    var isGaming = this.model._isGaming
    var modelState = this.model.state
    player.el = dom
    if(player.state == 2) {
      player.el.setAttribute('class', 'folded')
    } else {
      player.el.removeAttribute('class')
    }
    this.el.querySelector('.stage-players').appendChild(player.el)
  },
  renderAll: function() {
    this.renderBanker()
    this.model.players.forEach(player => {
      this.renderOne(player)
    })
  },
  renderAsk: function(hide) {
    var isTurn = this.model.state == 'turn',
      isGaming = this.model._isGaming
    var dom = this.askTemplate || document.querySelector('.stage-askBlock')
    if(isTurn && isGaming) {
    	if(this.model.pos != undefined){
      var isUidCorrect = this.model._uid == this.model.players[this.model.pos].uid
      console.log('ASK =>', this.model, isUidCorrect)
      if(isUidCorrect) {
        dom.setAttribute('data-hide', false)
      } else {
        dom.setAttribute('data-hide', true)
      }
      }
    } else {
      dom.setAttribute('data-hide', true)
    }

  },
  //btn of start
  renderStartBtn: function(uid) {
    if(uid != undefined) {
      this.model._uid = uid
    }
    var _uid = this.model._uid,
      m = this.model,
      isGaming = m._isGaming,
      btn = document.querySelector('button[class ~= stage-startBtn]'),
      modelState = m.state
      //perhaps p = undefined
      var p = m.players.find(p => p.uid == _uid)
      if(!p) return 
      var isHost = p.isHost,
      isReady = p.isReady
    console.log('render btn', isGaming, p, m)
    // 异步的情况下会导致 btn 所绑定的 dom 丢失 ? 
    var branches = {
      isHost: {
        'true': function() {
          btn.setAttribute('class', 'stage-startBtn')
          btn.disabled = false
          btn.innerText = '点击开始游戏'
        },
        'false': function() {
          btn.setAttribute('class', 'stage-startBtn')
          btn.disabled = false
          if(isReady) {
            btn.innerText = '取消准备'
          } else
            btn.innerText = '准备'
        }
      },
      isGaming: function() {
        btn.setAttribute('class', 'stage-startBtn stage-startBtn.disable')
        btn.disabled = true
        btn.innerText = '游戏中'
      }
    }
    console.log('START BTN RANDER PARAMS', isGaming, isHost)
    if(isGaming) {
      btn.setAttribute('data-hide', true)
      branches.isGaming()
    } else {
      btn.setAttribute('data-hide', false)
      branches.isHost[isHost]()
    }
  },
  //render chipfield
  renderChipField: function() {
    this.model.players.forEach(p => {

      let field = document.createElement('div')
      field.setAttribute('class', 'chipField')
      p.chipField = field
      this.table.appendChild(field)
      console.log('render chip field', p)

    })
  },
  //丢筹码动画效果	
  dropChipAnimate: function(player) {
    let chip = document.createElement('div')
    chip.innerText = player.outChip - player.chipField.innerText
    let wb = player.el.getBoundingClientRect(),
      swb = this.table.getBoundingClientRect(),
      x = wb.left - swb.left,
      y = swb.height / 2
    chip.style.left = x + 'px'
    chip.style.top = y + 'px'
    chip.setAttribute('class', 'droppedChip dropping')
    player.chipField.appendChild(chip)
  },
  //收筹码动画
  getChipAnimate: function(winner) {
    let chips = this.table.querySelectorAll('.droppedChip')
    let wb = winner.el.getBoundingClientRect(),
      sb = this.table.getBoundingClientRect(),
      x = wb.left - sb.left,
      y = wb.top - sb.top
    console.log('get =>', x, y, sb)
    //动画
    chips.forEach(dom => {
      dom.style.left = x + 'px'
      dom.style.top = y + 'px'
      dom.setAttribute('class', 'droppedChip getting')
    })
  }

}
/* harmony default export */ __webpack_exports__["a"] = (view);

/***/ })
/******/ ]);