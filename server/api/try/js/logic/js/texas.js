import Poker from './poker'
import Player from './player'
import arange from './10ChangeAlgorithem'
import valid from './valid'
import makehand from './testHands'
import scene from './scene'
var Texas = (function() {
  //封装
  //游戏主函数
  function Texas() {
    //卡池
    this.cardPool = []
    //玩家
    this.players = []
    //NPC
    this.banker = new Player('Banker', this)
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
  Texas.prototype = {
    init: function(isTest) {
    	//state machine init 
    	this.stateMap = {
    		'start' : new scene.scene_start(this),
    		'turn' : new scene.scene_turn(this),
    		'deal' : new scene.scene_deal(this),
    		'end' : new scene.scene_end(this),
    	}
      //初始化
      this.cardPool = []
      this.state = 'start'
      //this.players = []
      this.banker.init()
      this.banker.chippool = 0
      this.pos = undefined
      for(let i = 0; i < 52; i++) {
        this.cardPool[i] = new Poker(i)
      }
      // 检查玩家数量
      while(this.players.length < 3) {
        this.addPlayer()
      }
      //初始化玩家手牌
      this.players.forEach(p => p.init())
     
      //notify banker
      this.notifyObs('banker')
    },
    update: function() {
				this.stateMap[this.state].doing()
				console.log('update',this.state)
    },
    //
    dealToBank: function() {
      if(this.cardPool.length < 1) return console.log('没牌了')
      this.banker.addHand(1)
      this.notifyObs('banker')
    },
    addPlayer: function() {
      if(this.players.length > 9) return console.log('人满了大哥')
      let p = new Player(`Player:${this.players.length}`, this)
      p.init()
      this.players.push(p)
      return p
    },
    rankHands: function() {
      this.players.sort((a, b) => {
        return this.getHandVal(a) - this.getHandVal(b)
      })
    },
    validHand: valid // valid(player)
      ,
    // 可以用策略模式精简一下才对 先放着 先实现先
    regObs(type, fn) {
    	if(!Array.isArray(this.obsPool[type])) {
				this.obsPool[type] = []    		
    	}
    	this.obsPool[type].push(fn)
    }
    ,
    notifyObs(){
    	let arg = Array.from(arguments).slice(0)
    	let type = arg[0]
    	arg = arg.reduce((o,n)=>{
    		o.push(n)
    		return o
    	},[]).slice(1)
    	this.obsPool[type].forEach(f => f(...arg))
    },
    //btnhandler
    //adapter for drop chips
    dropChip: function(p, num) {
      num = parseInt(num)
      p.outChip += num
      p.changeChip(0 - num)
      this.banker.chippool += num
      //console.log('now chippool', this.banker.chippool)
      this.notifyObs('banker')
      this.notifyObs('dropChip',p)
    },
    //util
    plusPos: function(num) {
      let pos = this.pos != undefined ? this.pos : this.btn
      pos = parseInt(pos)
      for(let i = 0; i < num; i++)
        pos = pos + 1 == this.players.length ? 0 : pos + 1
      this.pos = pos
      return pos
    }
  }
  return new Texas()
})()
export default Texas