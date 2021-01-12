
var log4js = require('log4js');
const config_load = require('../tool/config_data_load');

var mode_path = config_load.electron_conf_load();

log4js.configure({
    appenders: {
        system: {type: 'file', filename: __dirname + "/" + mode_path + "../" + 'log/system.log'}
    },
    categories: {
        default: {appenders:['system'], level: 'debug'}
    }
});


var systemLogger = log4js.getLogger(); //getLogger('default')と同義

module.exports = systemLogger;