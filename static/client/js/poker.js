  function Poker(key) {
    this.key = key
    this.cardFace = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']
    this.typeFace = ['♠', '♥', '♣', '♦']
    this.val = Number.parseInt(this.key / 4)
    this.type = this.key % 4
    return {
      cardFace: `${this.typeFace[this.type]} ${this.cardFace[this.val]}`,
      key: this.key,
      type:this.type,
      val:this.val
    }
  }
//class Poker {
//	constructor(key) {
//	this.key = key
//  this.cardFace = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']
//  this.typeFace = ['♠', '♥', '♣', '♦']
//  this.val = Number.parseInt(this.key / 4)
//  this.type = this.key % 4
//  this.new()
//	}
//	static new(key) {
//		return this(key)
//	}
//}
  export default Poker