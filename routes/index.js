var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  let year = new Date().getFullYear()
  res.render('index', { title: 'Planfrei Kalender - ' + year })
})

module.exports = router
