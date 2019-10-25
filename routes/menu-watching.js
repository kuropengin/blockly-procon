var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('menu-programming', { title: 'データ選択' });
});

module.exports = router;