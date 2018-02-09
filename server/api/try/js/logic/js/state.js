/*翻牌前（Pre-flop）：发出底牌后,公共牌出现以前的第一轮叫注阶段
 * 翻牌（Flop）：前三张公共牌。
 * 翻牌圈（Flop-round）：前三张公共牌出现以后的押注圈。
 * 转牌（Turn）：第四牌公共牌
 * 转牌圈（Turn-round）：第四张出现以后的押注圈
 * 河牌（River）：第五张公共牌
 * 河牌圈（River-round）:第五张出现以后的押注圈
 * */

function state(model) {
  //model layer
  this.model = model
  // updating manage
  this.nowPos = 0
  //chip manage
  // model state 1 playing 0 waiting
  this.state = 1
  // last winner
  this.lastWinner = null
  //alive players
  this.alivePlayers = []
}
// 确定庄家，赢的当庄 或者初始 随机 
state.prototype.chooseBtn = function() {
  if(this.lastWinner && this.model.players.indexOf(this.lastWinner) != -1) {
    this.btn = this.model.players.indexOf(this.lastWinner)
  }
  else {
    //随机庄
    this.btn = ~~(Math.random() * this.model.players.length)
  } 
}
// start 
state.prototype.start = function() {
	//random 庄家
  this.chooseBtn()
  this.nowPos = this.btn
  console.log('bug start',this.btn,this.nowPos)
  //config
  this.alivePlayers = this.model.players.slice(0)
  //ask smallblind
  let sb = prompt('小盲注 下多少？', 2) - 0
 //cal
  let banker = this.model.banker
  //sb
	this.plusPos(1)  
	console.log(this.nowPos,this.alivePlayers)
  this.alivePlayers[this.nowPos].chip -= sb
  this.alivePlayers[this.nowPos].outchip += sb
  //bb
  let bb = prompt('大盲注下多少? 可以加', 2 * sb) - 0
  bb = bb >= 2 * sb ? bb : sb * 2
	this.plusPos(1)  
  this.alivePlayers[this.nowPos].chip -= bb
  this.alivePlayers[this.nowPos].outchip += bb
	//cal banker
	banker.chip = bb
	banker.chippool = sb + bb
}
//loop 
state.prototype.plusPos = function (num){
	for(let i = 0;i<num;i++)
  this.nowPos = this.nowPos + 1 >= this.alivePlayers.length ? 0 :  this.nowPos+1 //++this.nowPos
}
state.prototype.next = function() {
	// 是否下一轮
  //loop 条件 isAlive banker.hand.length != 5 
  let isContinue = this.model.banker.hand.length < 5 && this.alivePlayers.length > 0
  //loop
  if(isContinue) {
    let nowPlayer = this.model.players[this.nowPos]
    // 本轮 下一个人
    this.plusPos(1)
    console.log('compare=>',this.nowPos,this.btn)
    
  } else {
    //compare hands
    let winner = this.alivePlayers[0]
    winner =  this.alivePlayers.reduce((o,n)=>{
    	let nval = this.model.validHand(n),
    		oval = this.model.validHand(o)
    	return nval[1] < oval[1] ? o : n
    },winner)
    //get winner
    
    this.lastWinner = winner
    //不区分边池 全收 
    winner.changechip(this.model.banker.chippool)
    this.model.banker.chippool = 0
    this.model.banker.chip = 0
    this.model.players.forEach(p=>p.init())
    //提示冠军
    alert('winner is '+winner.name)
    //重开局 
    this.state = 0
  }
}
//next round 
state.prototype.nextRound = function () {
	this.model.banker.addHand(1)
	console.log('new turn')
}
// btn handler 
state.prototype.follow = function(player) {

	let _chip = this.model.banker.chip 
	player.chip -= _chip
	player.outchip += _chip
	
	this.model.banker.chippool += _chip
	console.log(player.name,'fol')
}
state.prototype.add = function(player) {
	let _chip = parseInt(prompt('add how many ?',0))
	player.chip -= _chip
	this.model.banker.chip += _chip
	player.outchip += _chip
	
	this.model.banker.chippool += _chip
	console.log('btnhandler')
}
state.prototype.fold = function(player){
	let index = this.alivePlayers.indexOf(player)
	this.alivePlayers.splice(index,1)
	this.nowPos = this.alivePlayers[this.nowPos] ? --this.nowPos : this.nowPos 
	console.log('folded',this.nowPos,this.alivePlayers.length)
}
export default state