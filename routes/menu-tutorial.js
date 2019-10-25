var express = require('express');
var router = express.Router();

var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    var stage_data = JSON.parse(fs.readFileSync('./load_data/tutorial_stage_data/stage_data.json', 'utf8'));
    
    res.render('menu-tutorial', { title: 'ステージ選択' ,stagedata: stage_data});
});

module.exports = router;