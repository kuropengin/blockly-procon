var express = require('express');
var router = express.Router();
const logger = require('../bin/logger.js');

var fs = require('fs');
var path = require('path');

//GET page
router.get('/', function(req, res, next) {
  try{
    var lg = req.cookies.lng;
    var LNG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "language", lg, "programming.json"), "utf-8"));
  }
  catch(e){
    var LNG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "language", "ja", "programming.json"), "utf-8"));
  }
  res.render('programming', { "title": 'プログラミング',"LNG":LNG});
});

module.exports = router;