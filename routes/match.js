var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');

const game_server_list = fs.readdirSync(path.join(__dirname, '..',  "load_data", "game_server_data"));
let game_server = {};
for(let gs of game_server_list){
    try{
        var temp_game_server = JSON.parse(fs.readFileSync(path.join(__dirname, '..',  'load_data','game_server_data',gs), 'utf8'));
        if(temp_game_server.room_id){
            game_server[temp_game_server.room_id] = temp_game_server;
        }
        else{
            logger.error('The format of the game server data is incorrect. Data to be loaded "' + gs + '"');
        }
    }
    catch(e){
        logger.error('Failed to read the game server data. Data to be loaded "' + gs + '"');
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('match');
});


router.get('/player', function(req, res, next) {
    if(req.query.room_id){
        try{
            if(game_server[req.query.room_id].cpu){
                if(game_server[req.query.room_id].cpu.turn == req.query.chara){
                    res.render('match-cpu');
                }
                else{
                    res.render('match-player');
                }
            }
            else{
                res.render('match-player');
            }
        }
        catch(e){
            console.log(e);
        }
    }
    else{
        res.render('match-player');
    }
});

module.exports = router;