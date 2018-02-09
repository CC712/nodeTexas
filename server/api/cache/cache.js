const Model = require('../try/js/model')
var db = global.resolvePath('server/db')
//cache
var rooms = [] // [json {}]
var test_room = new ROOM({
  id: make_id(0),
  title: '测试房间',
  abstract: '简介'
})
rooms.push(test_room)
var roomId = 0

function ROOM(config) {
  this.id = config.id
  this.__createDate = new Date() // unconfigable
  //state dictionary
  var waiting = 0,
    playing = 1,
    full = 2

  this.state = waiting
  this.model = new Model() // use its functions to modify itself
  for(let i in config) {
    if(!this[i])
      this[i] = config[i]
  }
}
ROOM.prototype.addPlayer = function(uid) {
  db.find('player', {
    uid: uid
  }).then(
    d => {
      this.model.addPlayer(new Player(d))
    }
  )
}
ROOM.prototype.removePlayer = function(uid) {
  this.model.removePlayer(uid)
}
ROOM.prototype.dismiss = function() {
  deleteRoomById(this.id)
}

function getRoomById(id) {
  if(!id) {
    let r = []
    rooms.forEach(i => r.push({
      id: i.id,
      title: i.title || 'default_title',
      abstract: i.abstract || "default abstract"
    }))
    return r
  }
  return rooms.find(function(room) {
    return room.id == id
  })
}

function padEnd(str, targetLength, padString) {
  targetLength = Number(targetLength)
  if(targetLength < str.length) {
    return str
  } else {
    var n = new Array(targetLength).fill(padString).join('')
    return(str + n).slice(0, targetLength)
  }
}

function make_id(idNum) {
  str_id = idNum + ''
  return padEnd(str_id, 6, '0')
}

function createRoom(config = {}) {

  config.id = make_id(rooms.length)
  var nr = new ROOM(config)
  rooms.push(nr)
  return nr

}

function deleteRoomById(id) {
  if(!id) return
  let it = getRoomById(id)
  return delete rooms[rooms.indexOf(it)]
}
module.exports = {
  createRoom,
  getRoomById,
  deleteRoomById
}