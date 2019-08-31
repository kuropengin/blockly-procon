var express = require('express');
var router = express.Router();

var socket_io = require('socket.io'); 

var io = socket_io();
router.io = io;

var fs = require('fs');
var game_server = JSON.parse(fs.readFileSync('./load_data/game_server_data/server_data.json', 'utf8'));

var server_list = [];
Object.keys(game_server).forEach(function(key) {
  server_list.push([game_server[key].name,key]);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('game', { title: 'Game',server_list:server_list });
});


var store = {};
var server_store = JSON.parse(JSON.stringify(game_server));

io.on('connection',function(socket){
  console.log('connected');
  
  socket.on('player_join', function(msg) {
    
    var people_num = Object.values(store).filter( function( value ) {
      return value.room === msg.room_id;
    });
    
    console.log( people_num.length );
    
    if(people_num.length < 2){
      var usrobj = {
        "room": msg.room_id,
        "name": msg.name,
        "chara": people_num.length
      };
      store[socket.id] = usrobj;
      socket.join(msg.room_id);
      
      io.to(socket.id).emit("updata_board", server_store[msg.room_id]);
      
      if(people_num.length == 1){
        
        socket.broadcast.to(msg.room_id).emit("you_turn");
      }
    }
    else{
      console.log( "_error" );
      io.to(socket.id).emit("error", "接続先サーバーは満室です");
    }

  });
  
  socket.on('move_player', function(msg) {
    if(store[socket.id].chara == 0){
      var c_x = server_store[store[socket.id].room].cool_x;
      var c_y = server_store[store[socket.id].room].cool_y;
      server_store[store[socket.id].room].map_data[c_y][c_x] = 0;
      if(msg === "top"){
        if(0 <= c_y - 1){
          server_store[store[socket.id].room].cool_y = c_y - 1;
          server_store[store[socket.id].room].map_data[c_y - 1][c_x] = 3;
        }
      }
      else if(msg === "bottom"){
        if(server_store[store[socket.id].room].map_size_y > c_y + 1){
          server_store[store[socket.id].room].cool_y = c_y + 1;
          server_store[store[socket.id].room].map_data[c_y + 1][c_x] = 3;
        }
      }
      else if(msg === "left"){
        if(0 <= c_x - 1){
          server_store[store[socket.id].room].cool_x = c_x - 1;
          server_store[store[socket.id].room].map_data[c_y][c_x - 1] = 3;
        }
      }
      else{
        if(server_store[store[socket.id].room].map_size_x > c_x + 1){
          server_store[store[socket.id].room].cool_x = c_x + 1;
          server_store[store[socket.id].room].map_data[c_y][c_x + 1] = 3;
        }
      }
      
      io.in(store[socket.id].room).emit("updata_board", server_store[store[socket.id].room]);
      socket.broadcast.to(store[socket.id].room).emit("you_turn");
    }
    else if(store[socket.id].chara == 1){
      var h_x = server_store[store[socket.id].room].hot_x;
      var h_y = server_store[store[socket.id].room].hot_y;
      server_store[store[socket.id].room].map_data[h_y][h_x] = 0;
      if(msg === "top"){
        if(0 <= h_y - 1){
          server_store[store[socket.id].room].hot_y = h_y - 1;
          server_store[store[socket.id].room].map_data[h_y - 1][h_x] = 4;
        }
      }
      else if(msg === "bottom"){
        if(server_store[store[socket.id].room].map_size_y > h_y + 1){
          server_store[store[socket.id].room].hot_y = h_y + 1;
          server_store[store[socket.id].room].map_data[h_y + 1][h_x] = 4;
        }
      }
      else if(msg === "left"){
        if(0 <= h_x - 1){
          server_store[store[socket.id].room].hot_x = h_x - 1;
          server_store[store[socket.id].room].map_data[h_y][h_x - 1] = 4;
        }
      }
      else{
        if(server_store[store[socket.id].room].map_size_x > h_x + 1){
          server_store[store[socket.id].room].hot_x = h_x + 1;
          server_store[store[socket.id].room].map_data[h_y][h_x + 1] = 4;
        }
      }
      
      io.in(store[socket.id].room).emit("updata_board", server_store[store[socket.id].room]);
      socket.broadcast.to(store[socket.id].room).emit("you_turn");
    }
    
  });
  
  socket.on('disconnect', function() {
    if (store[socket.id]) {
      var _roomid = store[socket.id].room;
      socket.leave(_roomid);
      delete store[socket.id];
      
      var people_num = Object.values(store).filter( function( value ) {
        return value.room === _roomid;
      });
      
      if(people_num.length == 0){
        server_store[_roomid] = JSON.parse(JSON.stringify(game_server[_roomid]));
      }
      
    }
  });
  
  
  
});


module.exports = router;