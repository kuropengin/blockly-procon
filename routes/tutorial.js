var express = require('express');
var router = express.Router();
const logger = require('../bin/logger.js');

var fs = require('fs');
var path = require('path');
//var stage_data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'load_data/tutorial_stage_data/stage_data.json'), 'utf8'));
const stage_data_list = fs.readdirSync(path.join(__dirname, '..',  "load_data", "tutorial_stage_data"));
let stage_data = {};
for(let sd of stage_data_list){
    try{
        var temp_stage_data = JSON.parse(fs.readFileSync(path.join(__dirname, '..',  'load_data','tutorial_stage_data',sd), 'utf8'));
        if(temp_stage_data.stage_id){
            stage_data[temp_stage_data.stage_id] = temp_stage_data;
        }
        else{
            logger.error('The format of the tutorial data is incorrect. Data to be loaded "' + sd + '"');
        }
    }
    catch(e){
        logger.error('Failed to read the tutorial data. Data to be loaded "' + sd + '"');
    }
}


/* GET home page. */
router.get('/', function(req, res, next) {
    
    try{
        var stage = req.query.stage;
        var xmldata = fs.readFileSync(path.join(__dirname, '..',  "load_data/workspace_xml_data/" + stage_data[stage].load_workspace), "utf-8");
        res.render('tutorial', { title: stage_data[stage].name , blockly_xml: xmldata , stagedata: stage_data[stage]});
    }
    catch(e){
        res.send('不正なアクセス');
    }
    
});

module.exports = router;
