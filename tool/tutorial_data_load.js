const fs = require('fs');
const path = require('path');
const logger = require('../bin/logger.js');

const config_load = require('../tool/config_data_load');

var mode_path = config_load.electron_conf_load();

const stage_data_list = fs.readdirSync(path.join(__dirname, mode_path, '..',  "load_data", "tutorial_stage_data"));
const workspace_list = fs.readdirSync(path.join(__dirname, mode_path, '..',  "load_data", "workspace_xml_data"));


let stage_data = {};
for(let sd of stage_data_list){
    try{
        var temp_stage_data = JSON.parse(fs.readFileSync(path.join(__dirname, mode_path, ".." ,"load_data","tutorial_stage_data",sd), 'utf8'));
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

let workspace_data = {};
for(let wd of workspace_list){
    try{
        var temp_workspace_data = fs.readFileSync(path.join(__dirname, mode_path, ".." ,"load_data","workspace_xml_data",wd), 'utf8');
        workspace_data[wd] = temp_workspace_data;      
    }
    catch(e){
        logger.error('Failed to read the tutorial data. Data to be loaded "' + wd + '"');
    }
}

const load = function(room=false){
    if(room){
        /*
        if("auto_block" in game_server[temp_game_server.room_id]){
          await create_map(temp_game_server.room_id);
        }
        */
        return stage_data[room];
    }
    else{
        return stage_data;
    }
};

const workspace_load = function(){
    return workspace_data;
};

exports.load = load;
exports.workspace_load = workspace_load;
