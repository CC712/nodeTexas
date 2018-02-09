function view(model, controllor) {
  // 需要有一个model容器
  this.model = model
  this.Controllor = controllor
  this.el = document.querySelector('body')
  this.table = document.querySelector('.table')
  this.playerTemplate = `<div class="player">
			<p class='name'></p><p>剩余筹码:<span	 class='chip'></span></p>
			<p>下注筹码:<span	 class='outChip'></span></p>
			<div class='pokers'></div>	
			<p>当前牌型:<span	 class='poker-val'></span></p>	
			</div>`
  this.bankerTemplate = `
			<p class='name'>庄家</p><p>池底:<span	 class='chippool'></span></p>
			<p>当前底注:<span	 class='chip'></span></p>	
			<div class='pokers'></div>	
			`
  this.askTemplate = document.querySelector('.ask')
  //regist obs
  // 前后端分离的情况下，这一部分是在前端的
  // 观察者模式要改啦
  // view 依赖于 model 
  // 怎么处理？
  
  this.model.regObs('banker', this.renderBanker.bind(this))
  this.model.regObs('player', this.renderAll.bind(this))
  this.model.regObs('ask', this.renderAsk.bind(this))
  this.model.regObs('dropChip', this.dropChipAnimate.bind(this))
  this.model.regObs('getChip', this.getChipAnimate.bind(this))
}
view.prototype.init = function() {
  this.table.innerHTML = ''
  console.log('chip init')

}
view.prototype.renderBanker = function() {
  let obj = this.model.banker
  let dom = obj.el || document.createElement('div')
  dom.innerHTML = this.bankerTemplate
  dom.querySelector('.name').innerText = obj.name
  dom.querySelector('.chippool').innerText = obj.chippool
  dom.querySelector('.chip').innerText = obj.chip
  obj.hand.sort((a, b) => a.key - b.key)
  obj.hand.forEach((p) => {
    let card = document.createElement('span')
    card.setAttribute('class', `poker-${p.type}`)
    card.innerText = `${p.cardFace}`
    dom.querySelector('.pokers').appendChild(card)
  }, )
  obj.el = dom
  document.querySelector('.banker').appendChild(obj.el)
}
view.prototype.renderOne = function(obj) {
  let dom = obj.el || document.createElement('div')
  dom.innerHTML = this.playerTemplate
  dom.querySelector('.name').innerText = obj.name
  dom.querySelector('.chip').innerText = obj.chip
  dom.querySelector('.outChip').innerText = obj.outChip
  obj.pokerVal = this.model.validHand(obj)
  dom.querySelector('.poker-val').innerText = obj.pokerVal[2] + '=》' + obj.pokerVal[1]

  obj.hand.sort((a, b) => a.key - b.key)
  // render poker
  obj.hand.forEach((p) => {
    let card = document.createElement('span')
    card.setAttribute('class', `poker-${p.type}`)
    card.innerText = `${p.cardFace}`
    dom.querySelector('.pokers').appendChild(card)
  }, )
  obj.el = dom
  if(obj.state == 2) {
    obj.el.setAttribute('class', 'folded')
  } else {
    obj.el.removeAttribute('class')
  }
  this.el.querySelector('.players').appendChild(obj.el)
}
view.prototype.renderAll = function() {
  this.renderBanker()
  this.model.players.forEach((player) => {
    this.renderOne(player)
    this.el.querySelector('.players').appendChild(player.el)
  })
}
view.prototype.renderAsk = function() {
  let player = arguments[0],
    bool = arguments[1]
  console.log('ASK =>', player, bool)
  let dom = this.askTemplate || document.querySelector('.ask')
  player.el.appendChild(dom)
  if(bool !== false) {
    dom.style.display = 'flex'
  } else {
    dom.style.display = 'none'
  }
}
//render chipfield
view.prototype.renderChipField = function() {
  this.model.players.forEach(p => {
    let field = document.createElement('div')
    field.setAttribute('class', 'chipField')
    p.chipField = field
    this.table.appendChild(field)
  })
}
//丢筹码动画效果	
view.prototype.dropChipAnimate = function(player) {
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
}
//收筹码动画
view.prototype.getChipAnimate = function(winner) {
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