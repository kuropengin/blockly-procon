var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');

var LNG_JA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "language", "ja", "menu-watching.json"), "utf-8"));
var LNG_JAK = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "language", "ja-k", "menu-watching.json"), "utf-8"));
var CONFIG_LNG_JA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "language", "ja", "config.json"), "utf-8"));
var CONFIG_LNG_JAK = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "language", "ja-k", "config.json"), "utf-8"));


/* GET home page. */
router.get('/', function(req, res, next) {
    try{
        if(req.cookies.lng){
            if(req.cookies.lng == "ja"){
                res.render('menu-match', { title: 'ルーム選択', LNG: LNG_JA, C_LNG: CONFIG_LNG_JA});
            }
            else if(req.cookies.lng == "ja-k"){
                res.render('menu-match', { title: 'ルームせんたく',LNG: LNG_JAK, C_LNG: CONFIG_LNG_JAK});
            }
            else{
                res.render('menu-match', { title: 'ルーム選択',LNG: LNG_JA, C_LNG: CONFIG_LNG_JA});
            }
        }
        else{
            res.render('menu-match', { title: 'ルーム選択',LNG: LNG_JA, C_LNG: CONFIG_LNG_JA});
        }
    }
    catch(e){
       res.render('menu-match', { title: 'ルーム選択',LNG: LNG_JA, C_LNG: CONFIG_LNG_JA}); 
    }
});

module.exports = router;