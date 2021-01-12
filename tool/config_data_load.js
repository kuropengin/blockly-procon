const fs = require('fs');
const path = require('path');
const logger = require('../bin/logger.js');

const electron_conf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config','electron_conf.json'), 'utf8'));

const electron_conf_load = function(room=false){
    if(electron_conf.exe_mode){
        return "../../";
    }
    else{
        return ".";
    }
};

exports.electron_conf_load = electron_conf_load;