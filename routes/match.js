var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var server_data = require('../tool/server_data_load');

const game_server = JSON.parse(JSON.stringify(server_data.load()));


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