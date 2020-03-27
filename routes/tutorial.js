var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var stage_data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'load_data/tutorial_stage_data/stage_data.json'), 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {
    
    try{
        var stage = req.query.stage;
        var xmldata = fs.readFileSync(path.join(__dirname, '..', "load_data/workspace_xml_data/" + stage_data[stage].load_workspace), "utf-8");
        res.render('tutorial', { title: stage_data[stage].name , blockly_xml: xmldata , stagedata: stage_data[stage]});
    }
    catch(e){
        res.send('不正なアクセス');
    }
    
});

module.exports = router;