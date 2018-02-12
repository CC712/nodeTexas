const db = global.resolvePath('server/db.js')

function switchScene(s, that) {
  console.log('state change from ', that.state, 'to', s)
  that.state = s
}
// MODE; STATE MODEL STATE 
var scene_start = function(model) {
  return {
    doing: () => {
      var that = model
      //上一局的痕迹，初始化
      that.players.forEach(p => {
      	p.init()
      })
			
      //盲注
      //    that.btn = ~~(Math.random() * that.players.length)
      that.pos = that.btn
      //sb
      that.plusPos(1)
      that.dropChip(that.players[that.pos], 2)
      //bb
      that.plusPos(1)
      that.dropChip(that.players[that.pos], 4)
      //归零 从小盲开始
      that.pos = that.btn
      that.plusPos(1)
      //发公牌
      that.banker.addHand(3, that)
      console.log('hand poker banker', that.banker.hand)
      that.players.forEach(p => {
        p.addHand(2, that)
        p.state = 1
      })

      // 进入决策
      switchScene('turn', that)
    }
  }
}
// 改变pos 的位置
var scene_turn = function(model) {
  return {
    doing: () => {
      var that = model
      //aliveplayers not enough
      var alivePlayers = that.players.filter(p => p.state == 1 || p.state == 0)
      console.log('aliveplayer length =>', alivePlayers.length)
      //winner eat chicken dinner
      // bug
      if(alivePlayers.length == 1) {
        alivePlayers[0].state = 0
        switchScene('end', that)
        that.update()
        return
      }
      //enough players
      var lastp = that.pos
      // 决策后 才跳转 就是要pos加 1 以及 state change
      //会有 fold的 所以要 while
      while(that.players[that.pos].state != 1) {
        that.plusPos(1)
        // 转了一圈了
        if(that.players.every(p => p.state != 1)) {

          switchScene('deal', that)
          that.update()
          return
        }
      }

      let p = that.players[that.pos]
      p.state = 0 // moved

    }
  }
}
var scene_deal = function(model) {
  return {
    doing: () => {
      var that = model
      that.banker.addHand(1, that)
      if(that.banker.hand.length == 5) {
        // hide ask
        //next state
        switchScene('end', that)
        that.update()
        return
      }

      //直接在小盲的位置上 start 就不用多余 发牌挪一步了
//    that.plusPos(1)
      that.players.forEach(p => {
        if(p.state == 0) 
        	p.state = 1
      })
      switchScene('turn', that)

    }
  }
}

var scene_end = function(model) {
  return {
    doing: () => {
      var that = model
      that._isGaming = false
      console.log('hello end', that.players)
      // hide ask

      //winner
      var alivePlayers = that.players.filter(p => p.state == 0)
      console.log('LAST ALIVE PLAYERS', alivePlayers, that.players )
      var winner = alivePlayers[0]
      //buggy
      alivePlayers.forEach(p => {
        winner = p.pokerValue[1] < winner.pokerValue[1] ? p : winner
      })
      if(winner){
      console.log(winner.uid, '<==winner', winner.hand)
      }
      //getchip 
      //bug no winner 
      winner.changeChip(that.banker.chippool)
      that.btn = that.players.findIndex(p => p.uid == winner.uid)
      that.btnUid = winner.uid
      //state
      switchScene('start', that)
      //db
      var ndb = db.getDB()
      for(let p of model.players) {
        if(p) {
          ndb.update('player', {
            uid: Number(p.uid),
          }, {
            $set: {
              chip: p.chip,
              __lastGameTime: new Date()
            }
          })
        }
      }
      
    }
  }
}
/*
 *convert circle json 了
 * 解决办法是 改变循环引用
 *办法就是不能用类了
 * 柯丽化可以避免重复引用的问题，其实就是传参，感觉差了点味道
 * */

module.exports = {
  scene_start,
  scene_end,
  scene_turn,
  scene_deal
}