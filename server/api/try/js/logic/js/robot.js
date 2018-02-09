//always follow
// chip = 99999999
//name robot 

//FSM

var robot = function (rid, uid){
	this.rid = rid
	this.uid = uid
}
// emit can move 
// then do follow


this.emit('robotCanMove', uid)

this.receive('robotCanMove', function (uid){
	if(uid !== this.player.uid) return
	
	if(this.room.model.players[this.model.pos].uid == this.uid)
	robot.setFollow
	return
	if(this.model._isGaming == false)
	robot.setReady
	return
	if( this.model.player.every(p=>p.isReady == true))
	robot.setStart
	return
})
