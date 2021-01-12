const fs = require('fs');
const path = require('path');
const logger = require('../bin/logger.js');
const config_load = require('../tool/config_data_load');

var mode_path = config_load.electron_conf_load();

const bgm_list = fs.readdirSync(path.join(__dirname, mode_path, '..', "load_data", "bgm_data"));

const load = function(room=false){
    return bgm_list; 
};

exports.load = load;
