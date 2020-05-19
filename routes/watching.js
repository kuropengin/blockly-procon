var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var server_list = JSON.parse(fs.readFileSync(path.join(__dirname, '..',  'load_data/game_server_data/server_data.json'), 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {
    var roomId,roomName;
    if(req.query.room_id){
        roomName = server_list[req.query.room_id].name;
        roomId = req.query.room_id;
    }
    else{
        roomName = "デフォルト";
        roomId = false;
    }
    res.render('watching', { title: roomName, id: roomId});
});

module.exports = router;