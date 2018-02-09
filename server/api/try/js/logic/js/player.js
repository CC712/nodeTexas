//import Valid from './valid'
const Valid = require('./valid')
function Player(data, model) {
  this.hand = []
  this.chip = 1000
  this.outChip = 0
  this.name = data.name || data.uid
  // 0 moved 1 willmove 2 dead 3 watching
  this.state = 3
  this.pokerValue = null
  this.isHost = false
  this.isReady = false
}
Player.prototype = {
  init: function(data) {
//	console.log('HERE PLAYER BE INITED !!!!!!!!!!!!!!!!!!!!!')
    this.hand = []
    this.outChip = 0
    this.state = 3
    this.isReady = false
    for(let i in data)
    	this[i] = data[i]
  },
  // 这个是外挂接口
  changeChip: function(val) {
    this.chip += val
    this.state = 0
  },
  addHand: function(number, model) {
  	// 避免循环引用 player 没有 model 
  	console.log('addhand ', number )
    var pool = model.cardPool
    for(; number > 0; number--) {
      let poker = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]
      this.hand.push(poker)
    }
    this.valid(model)
  },
  valid : function (model){
  	return this.pokerValue =  Valid(this, model)
  }
}
//export default Player
module.exports = Player