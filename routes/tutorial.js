var express = require('express');
var router = express.Router();

var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    var stage_data = JSON.parse(fs.readFileSync('./load_data/tutorial_stage_data/stage_data.json', 'utf8'));
    
    try{
        var stage = req.query.stage;
        var xmldata = fs.readFileSync("./load_data/workspace_xml_data/" + stage_data[stage].load_workspace, "utf-8");
        res.render('tutorial', { title: 'チュートリアル' , blockly_xml: xmldata , stagedata: stage_data[stage]});
    }
    catch(e){
        res.send('不正なアクセス');
    }
    
});

module.exports = router;