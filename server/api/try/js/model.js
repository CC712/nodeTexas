const db = global.resolvePath('db.js')
const Player = require('./logic/js/player')
const Poker = require('./logic/js/poker')
const scene = require('./logic/js/scene')
const valid = require('./logic/js/valid')
const makehand = require('./logic/js/testHands')
var ndb = db.getDB()
//游戏主函数
var model = function() {
  // 初始化本地数据

  //卡池 应当是对客户端不可见
  this.cardPool = []
  //玩家
  this.players = []
  //NPC
  this.banker = new Player({
    name: 'Banker'
  }, this)
  this.banker.chip = 0
  this.banker.chippool = 0
  this.state = 'start'
  this.stateMap = {}
  //game params
  this.aBlindChip = 4
  this.btn = 0
  //position 
  this.pos = 0
  this.init()
}
model.prototype.init = function() {
  //state machine init 
  this.stateMap = {
    'start': scene.scene_start(this),
    'turn': scene.scene_turn(this),
    'deal': scene.scene_deal(this),
    'end': scene.scene_end(this),
  }
  //初始化 
  //庄
  var getBtn = () => {
    if(this.btnUid != undefined){
    	return this.players.findIndex(p => p.uid == this.btnUid)
    }
    return 0
  }

  this.cardPool = []
  this.state = 'start'
  //this.players = []
  this.banker.init()
  this.banker.chippool = 0
  this.btn = getBtn()
  this.pos = 0
  this.cardPool = new Array(52)
  //this.cardPool.map((x, i) => new Poker(i))
  //map and foreach will pass the invalid block
  // also in of operate notation are the same
  for(let i = 0; i < 52; i++) {
    this.cardPool[i] = new Poker(i)
  }

  //初始化玩家手牌
  this.players.forEach(p => p.init())
}
const playerFn = require('./playerFn')
model.prototype.playerFn = function(name, uid, args = []) {
  var p = this.findPlayer(uid),
    fn = playerFn[name]
  console.log('% function %', name)
  fn.apply(this, args)
  this.update()
}
// start 
model.prototype.start = function() {
  if(this._isGaming) return
  //开始的要求
  //所有人准备
  //人数足够
  // 前后端都需要校验 为了准确性
  if(this.players.length < 2) {
    return new Error('no enough players')
  }
  this._isGaming = true
  this.init()
  this.update()
}
model.prototype.update = function() {
  this.stateMap[this.state].doing()
  console.log('^ yes update do ^')
}
model.prototype.validHand = function() {
  this.players.forEach(p => p.Valid())
}
model.prototype.findPlayer = function(uid) {
  return this.players.find(p => p.uid == uid)
}
model.prototype.insertPlayer = function(uid) {
  ndb = db.getDB()
  return ndb.find('player', {
    uid: Number(uid)
  }).then(r => {
    console.log('insert confirm', r)
    typeof r == 'array' ? r = r[0] : r = r
    if(r.length > 0) {
      console.log('* get player uid *  ', uid, r)
      let p = new Player(r, this)
      //房间属性 没有房间的改变就没有房主的概念 故不在player  的内部设置属性
  			p.isHost = false
  			p.uid = uid
      this.players.push(p)
      if(this.players.indexOf(p) == 0)
      	p.isHost = true
      }
      return true
  })
}

model.prototype.removePlayer = function(uid) {
  if(this.players.length == 0) {
    //如果人数 == 0
    // 房间不删除
    ndb.log('该房间已经空')
    return reject(new Error('room is empty'))
  }
  var idx = 0
  var result = this.players.find(function(x, index) {
    if(x.uid == uid) {
      idx = index
      return true
    }
  })
  if(result) {
    this.players.splice(idx, 1)
    var key = this.btn || 0
    this.players[key].isHost = true 
    
  } else {
    ndb.log('invalid player request for this room')
  }

}
model.prototype.dropChip = function(p, num) {
  num = parseInt(num)
  p.outChip += num
  p.changeChip(0 - num)
  this.banker.chippool += num
}
//util
model.prototype.plusPos = function(num = 1) {
  var opos = this.pos - 0
  let pos = this.pos != undefined ? this.pos : this.btn
  pos = parseInt(pos)
  for(let i = 0; i < num; i++) {
    if(pos + 1 == this.players.length) {
      pos = 0
    } else pos++
  }
  this.pos = pos
  console.log(`pos from ${opos} to ${pos}`)
  return pos
}

module.exports = model