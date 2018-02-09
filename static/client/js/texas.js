import Poker from './poker'
import Player from './player'
import arange from './10ChangeAlgorithem'
import valid from './valid'
import makehand from './testHands'
import scene from './scene'
import ajax from '../../ajax'
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
export default Texas