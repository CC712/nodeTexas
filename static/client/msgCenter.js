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
export default {
	makeMc,
	getMc
}
