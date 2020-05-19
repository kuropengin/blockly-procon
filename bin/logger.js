
var log4js = require('log4js');

log4js.configure({
    appenders: {
        system: {type: 'file', filename: __dirname + '/log/system.log'}
    },
    categories: {
        default: {appenders:['system'], level: 'debug'}
    }
});


var systemLogger = log4js.getLogger(); //getLogger('default')と同義

module.exports = systemLogger;