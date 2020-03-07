var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var stage_data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'load_data/tutorial_stage_data/stage_data.json'), 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('menu-tutorial', { title: 'ステージ選択' ,stagedata: stage_data});
});

module.exports = router;