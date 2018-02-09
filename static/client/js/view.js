function view(model, controllor) {
  this.model = model
  this.Controllor = controllor
  this.el = document.querySelector('.stage')
  this.table = document.querySelector('.stage-table')
  this.playerTemplate = `<div class="player">
  		<p class = 'self'>You</p>
			<p class='name'></p><p>剩余筹码:<span	 class='chip'></span></p>
			<p>下注筹码:<span	 class='outChip'></span></p>
			<div class='pokers'></div>	
			<p>当前牌型:<span	 class='poker-value'></span></p>	
			</div>`
  this.bankerTemplate = `
			<p class='name'>庄家</p><p>池底:<span	 class='chippool'></span></p>
			<p>当前底注:<span	 class='chip'></span></p>	
			<div class='pokers'></div>	
			`
  this.askTemplate = document.querySelector('.stage-askBlock')
  //regist obs
  this.model.regObs('banker', this.renderBanker.bind(this))
  this.model.regObs('player', this.renderAll.bind(this))
  this.model.regObs('ask', this.renderAsk.bind(this))
  this.model.regObs('dropChip', this.dropChipAnimate.bind(this))
  this.model.regObs('getChip', this.getChipAnimate.bind(this))
  this.model.regObs('start-btn', this.renderStartBtn.bind(this))
}
view.prototype = {
  init: function() {
    this.table.innerHTML = ''
    console.log('chip init')
  },
  renderBanker: function() {
    let obj = this.model.banker
    let dom = document.querySelector('.stage-banker')
    dom.innerHTML = this.bankerTemplate
    dom.querySelector('.name').innerText = obj.name
    dom.querySelector('.chippool').innerText = obj.chippool
    dom.querySelector('.chip').innerText = obj.chip
    if(this.model.state !== 'start') {
      obj.hand.sort((a, b) => a.key - b.key)
      obj.hand.forEach((p) => {
        let card = document.createElement('span')
        card.setAttribute('class', `poker-${p.type}`)
        card.innerText = `${p.cardFace}`
        dom.querySelector('.pokers').appendChild(card)
      })
    }
  },
  renderOne: function(player) {
    var dom = document.querySelector(`[data-uid=uid${player.uid}]`) || document.createElement('div')
    //  console.log('renderOne:', player)
    dom.innerHTML = this.playerTemplate
    dom.setAttribute('data-uid', 'uid' + player.uid)
    // host
    if(player.isHost)
      dom.setAttribute('data-role', 'host')
    else dom.setAttribute('data-role', 'guest')
    dom.setAttribute('data-ready', player.isReady && this.model._isGaming == false)

    dom.querySelector('.name').innerText = player.name || `u${player.uid}`
    dom.querySelector('.chip').innerText = player.chip
    dom.querySelector('.outChip').innerText = player.outChip
    // 		dom.querySelector('.poker-value').innerText = player.pokerValue[2] + '=》' + player.pokerValue[1]
    // render poker
    player.hand.forEach(p => {
      let card = document.createElement('span')
      card.setAttribute('class', `poker-${p.type}`)
      card.innerText = `${p.cardFace}`
      dom.querySelector('.pokers').appendChild(card)
    })
    //self 
    if(player.uid == this.model._uid) {
      dom.querySelector('.self').setAttribute('data-hide', false)
    } else {
      dom.querySelector('.self').setAttribute('data-hide', true)
    }
    //current player 
    var cur_player = this.model.players[this.model.pos]
    //player uid not exists 
    if(cur_player) {
      console.log('cur player', cur_player.uid, player.uid)
      if(player.uid == cur_player.uid) {
        dom.setAttribute('data-cur', true)
      } else {
        dom.setAttribute('data-cur', false)
      }
    }
    //player
    var isGaming = this.model._isGaming
    var modelState = this.model.state
    player.el = dom
    if(player.state == 2) {
      player.el.setAttribute('class', 'folded')
    } else {
      player.el.removeAttribute('class')
    }
    this.el.querySelector('.stage-players').appendChild(player.el)
  },
  renderAll: function() {
    this.renderBanker()
    this.model.players.forEach(player => {
      this.renderOne(player)
    })
  },
  renderAsk: function(hide) {
    var isTurn = this.model.state == 'turn',
      isGaming = this.model._isGaming
    var dom = this.askTemplate || document.querySelector('.stage-askBlock')
    if(isTurn && isGaming) {
    	if(this.model.pos != undefined){
      var isUidCorrect = this.model._uid == this.model.players[this.model.pos].uid
      console.log('ASK =>', this.model, isUidCorrect)
      if(isUidCorrect) {
        dom.setAttribute('data-hide', false)
      } else {
        dom.setAttribute('data-hide', true)
      }
      }
    } else {
      dom.setAttribute('data-hide', true)
    }

  },
  //btn of start
  renderStartBtn: function(uid) {
    if(uid != undefined) {
      this.model._uid = uid
    }
    var _uid = this.model._uid,
      m = this.model,
      isGaming = m._isGaming,
      btn = document.querySelector('button[class ~= stage-startBtn]'),
      modelState = m.state
      //perhaps p = undefined
      var p = m.players.find(p => p.uid == _uid)
      if(!p) return 
      var isHost = p.isHost,
      isReady = p.isReady
    console.log('render btn', isGaming, p, m)
    // 异步的情况下会导致 btn 所绑定的 dom 丢失 ? 
    var branches = {
      isHost: {
        'true': function() {
          btn.setAttribute('class', 'stage-startBtn')
          btn.disabled = false
          btn.innerText = '点击开始游戏'
        },
        'false': function() {
          btn.setAttribute('class', 'stage-startBtn')
          btn.disabled = false
          if(isReady) {
            btn.innerText = '取消准备'
          } else
            btn.innerText = '准备'
        }
      },
      isGaming: function() {
        btn.setAttribute('class', 'stage-startBtn stage-startBtn.disable')
        btn.disabled = true
        btn.innerText = '游戏中'
      }
    }
    console.log('START BTN RANDER PARAMS', isGaming, isHost)
    if(isGaming) {
      btn.setAttribute('data-hide', true)
      branches.isGaming()
    } else {
      btn.setAttribute('data-hide', false)
      branches.isHost[isHost]()
    }
  },
  //render chipfield
  renderChipField: function() {
    this.model.players.forEach(p => {

      let field = document.createElement('div')
      field.setAttribute('class', 'chipField')
      p.chipField = field
      this.table.appendChild(field)
      console.log('render chip field', p)

    })
  },
  //丢筹码动画效果	
  dropChipAnimate: function(player) {
    let chip = document.createElement('div')
    chip.innerText = player.outChip - player.chipField.innerText
    let wb = player.el.getBoundingClientRect(),
      swb = this.table.getBoundingClientRect(),
      x = wb.left - swb.left,
      y = swb.height / 2
    chip.style.left = x + 'px'
    chip.style.top = y + 'px'
    chip.setAttribute('class', 'droppedChip dropping')
    player.chipField.appendChild(chip)
  },
  //收筹码动画
  getChipAnimate: function(winner) {
    let chips = this.table.querySelectorAll('.droppedChip')
    let wb = winner.el.getBoundingClientRect(),
      sb = this.table.getBoundingClientRect(),
      x = wb.left - sb.left,
      y = wb.top - sb.top
    console.log('get =>', x, y, sb)
    //动画
    chips.forEach(dom => {
      dom.style.left = x + 'px'
      dom.style.top = y + 'px'
      dom.setAttribute('class', 'droppedChip getting')
    })
  }

}
export default view