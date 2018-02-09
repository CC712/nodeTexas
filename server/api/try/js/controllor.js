const btn_handlers = require('./btn_handlers')
const cache = require('../../cache/cache')

function Controllor(model) {
  this.model = model
}
// 验证牌型 
Controllor.prototype.valid = function() {
  this.model.validHand()
}
//初始化   控制器 这就是   model -> dom html  
Controllor.prototype.init = function(isTest) {
  this.model.init(isTest)
}
// 增加玩家
Controllor.prototype.addPlayer = function() {
  let newplayer = this.model.addPlayer()
}
//start
Controllor.prototype.start = function() {
  //创建玩家
  this.model.init()
  //view init
  //游戏开始
  this.model.update()
}

module.exports = Controllor