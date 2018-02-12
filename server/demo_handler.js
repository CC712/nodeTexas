const assert = require('assert')
//router get
const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()
// /?id = 0 
var config = {
  dir: path.join(__dirname, '../../demo')
}

router.get('/', (req, res, next) => {
  var id = req.query.id
  var demo_path = path.join(config.dir, `./${id}`)
  fs.readFile(demo_path + '/demo.config.json', 'utf-8', (err, fd) => {
    if(err) {
      res.status(404).end('NO THIS DEMO')
      return
    }
    var d_c = JSON.parse(fd)
    var entry = d_c.entry
    var entry_p = path.join(demo_path, entry)
    console.log(entry_p)
    res.header('Content-Type', 'text/html;charset=utf-8')
    res.sendFile(entry_p, (err) => {
      if(err) {
        res.sendStatus(500)
        return
      }
    })

  })
})
module.exports = router