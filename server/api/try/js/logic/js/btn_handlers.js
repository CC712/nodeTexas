var follow = function() {
  let _chip = this.banker.chip
  this.dropChip(this.players[this.pos], _chip)
}
var add = function() {
  this.dropChip(this.players[this.pos], this.aBlindChip)
}

var allin = function() {
  this.dropChip(this.players[this.pos], this.players[this.pos].chip)
}

var fold = function() {
  this.players[this.pos].state = 2
  this.notifyObs('player')
}
export default {
	fold,
	allin,
	add,
	follow
}
