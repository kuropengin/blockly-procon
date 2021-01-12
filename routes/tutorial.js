var express = require('express');
var router = express.Router();
const logger = require('../bin/logger.js');

var fs = require('fs');
var path = require('path');
var tutorial_data = require('../tool/tutorial_data_load');


const stage_data = JSON.parse(JSON.stringify(tutorial_data.load()));
const workspace_data = tutorial_data.workspace_load();

/* GET home page. */
router.get('/', function(req, res, next) {
    
    try{
        var stage = req.query.stage;
        if(workspace_data[stage_data[stage].load_workspace]){
            var xmldata =  workspace_data[stage_data[stage].load_workspace];
            res.render('tutorial', { title: stage_data[stage].name , blockly_xml: xmldata , stagedata: stage_data[stage]});
        }
        else{
            res.send('ワークスペース読み込みエラー');
        }
    }
    catch(e){
        res.send('不正なアクセス');
    }
    
});

module.exports = router;
