import TexasView from './view'
import ajax from '../../ajax'
var __host = `//139.199.188.25:8000` 
function Controllor(model) {

  this.model = model
  this.view = new TexasView(this.model, this)
  this.polling = null
}
Controllor.prototype.getData = function() {
  return ajax({
    url:  __host +'/api/v1/room/' + this.model.roomid
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
    ajax({
      url:  __host  + `/api/v1/room/${this.model.roomid}/start`,
      method: 'post'
    }).then(r => {
        r.data && this.model.init(r.data)
    }).catch(err => {
      alert(err)
    })
  } else {
  	alert(`player ready => ${p.isReady}`)
    ajax({
      url:  __host  + `/api/v1/room/${this.model.roomid}/player/${uid}/ready`,
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
  ajax({
    url:  __host  + `/api/v1/room/${this.model.roomid}/player/${this.model._uid}/${method}`,
    method: 'post'
  })
 	this.view.renderAsk(true)
}
//handler
Controllor.prototype.addPlayer = function(uid) {
  ajax({
    url:  __host  + `/api/v1/room/${this.model.roomid}/player/${uid}`,
    method: 'post'
  }).catch(err => {
    console.log('this is a err', err)
  })
}
Controllor.prototype.delPlayer = function(uid) {
  ajax({
    url:  __host  + `/api/v1/room/${this.model.roomid}/player/${uid}`,
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
    ajax({
      url:  __host +'/api/v1/room/' + this.roomid + '/start'
    }).then(r => {
      if(r.data)
        this.model.init(r.data.model)
      else return new Error(r.msg)
    }).catch(err => {
      console.log('this is a err', err)
    })
  }
}
export default Controllor

//组件内部可以是事件驱动