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
  res.render('game', { title: 'フリープレイ',server_list:server_list });
});


var store = {};
var server_store = JSON.parse(JSON.stringify(game_server));

function cpu_turn(data){
  
}


function game_result_check(socket,winer){
  
  if(server_store[store[socket.id].room].turn == 0){
    server_store[store[socket.id].room].play = false;
    if(server_store[store[socket.id].room].cool_score > server_store[store[socket.id].room].hot_score){
      winer = "cool";
    }
    else if(server_store[store[socket.id].room].cool_score < server_store[store[socket.id].room].hot_score){
      winer = "hot";
    }
    else{
      winer = "draw";
    }
    io.in(store[socket.id].room).emit("game_result",{
      "winer": winer
    });
  }
  
  var rcx = server_store[store[socket.id].room].cool_x;
  var rcy = server_store[store[socket.id].room].cool_y;
  var rhx = server_store[store[socket.id].room].hot_x;
  var rhy = server_store[store[socket.id].room].hot_y;
  
  var c_t,c_b,c_r,c_l,h_t,h_b,h_r,h_l;
  
  if(rcx - 1 < 0){
    c_l = 1;
    c_r = server_store[store[socket.id].room].map_data[rcy][rcx + 1];
  }
  else if(rcx + 1 > server_store[store[socket.id].room].map_size_x - 1){
    c_l = server_store[store[socket.id].room].map_data[rcy][rcx - 1];
    c_r = 1;
  }
  else{
    c_l = server_store[store[socket.id].room].map_data[rcy][rcx - 1];
    c_r = server_store[store[socket.id].room].map_data[rcy][rcx + 1];
  }
  
  if(rcy - 1 < 0){
    c_t = 1;
    c_b = server_store[store[socket.id].room].map_data[rcy + 1][rcx];
  }
  else if(rcy + 1 > server_store[store[socket.id].room].map_size_y - 1){
    c_t = server_store[store[socket.id].room].map_data[rcy - 1][rcx];
    c_b = 1;
  }
  else{
    c_t = server_store[store[socket.id].room].map_data[rcy - 1][rcx];
    c_b = server_store[store[socket.id].room].map_data[rcy + 1][rcx];
  }
  
  
  if(rhx - 1 < 0){
    h_l = 1;
    h_r = server_store[store[socket.id].room].map_data[rhy][rhx + 1];
  }
  else if(rhx + 1 > server_store[store[socket.id].room].map_size_x - 1){
    h_l = server_store[store[socket.id].room].map_data[rhy][rhx - 1];
    h_r = 1;
  }
  else{
    h_l = server_store[store[socket.id].room].map_data[rhy][rhx - 1];
    h_r = server_store[store[socket.id].room].map_data[rhy][rhx + 1];
  }
  
  if(rhy - 1 < 0){
    h_t = 1;
    h_b = server_store[store[socket.id].room].map_data[rhy + 1][rhx];
  }
  else if(rhy + 1 > server_store[store[socket.id].room].map_size_y - 1){
    h_t = server_store[store[socket.id].room].map_data[rhy - 1][rhx];
    h_b = 1;
  }
  else{
    h_t = server_store[store[socket.id].room].map_data[rhy - 1][rhx];
    h_b = server_store[store[socket.id].room].map_data[rhy + 1][rhx];
  }
  
  
  if(c_t == 1 && c_b == 1  && c_r == 1 && c_l == 1){
    winer = "hot";
  }
  
  if(h_t == 1 && h_b == 1  && h_r == 1 && h_l == 1){
    winer = "cool";
  }
  
  if(c_t == 1 && c_b == 1  && c_r == 1 && c_l == 1 && h_t == 1 && h_b == 1  && h_r == 1 && h_l == 1){
    winer = "draw";
  }
  
  
  if(winer && server_store[store[socket.id].room].play){
    server_store[store[socket.id].room].play = false;
    io.in(store[socket.id].room).emit("game_result",{
      "winer": winer
    });
  }
  else{
    if(store[socket.id].chara == 0){
      if(server_store[store[socket.id].room].vs == "cpu"){
        cpu_turn({
          "x":server_store[store[socket.id].room].hot_x,
          "y":server_store[store[socket.id].room].hot_y,
          "map_data":server_store[store[socket.id].room].map_data
        });
      }
      else{
        socket.broadcast.to(store[socket.id].room).emit("you_turn",{
          "x":server_store[store[socket.id].room].hot_x,
          "y":server_store[store[socket.id].room].hot_y,
          "map_data":server_store[store[socket.id].room].map_data
        });
      }
    }
    else{
      socket.broadcast.to(store[socket.id].room).emit("you_turn",{
        "x":server_store[store[socket.id].room].cool_x,
        "y":server_store[store[socket.id].room].cool_y,
        "map_data":server_store[store[socket.id].room].map_data  
      });
    }
  }
}

function create_map(key){
  var map = new Array(server_store[key].map_size_y);
  for(let y = 0; y < server_store[key].map_size_y; y++) {
    map[y] = new Array(server_store[key].map_size_x).fill(0);
  }
  
  server_store[key].map_data = map;
  
  
  var effect = new Array(server_store[key].map_size_y);
  for(let y = 0; y < server_store[key].map_size_y; y++) {
    effect[y] = new Array(server_store[key].map_size_x).fill(0);
  }
  
  server_store[key].effect = effect;
  
  
  var cx = Math.floor( Math.random() * (server_store[key].map_size_x - 3) ) + 1;
  var cy = Math.floor( Math.random() * (server_store[key].map_size_y - 3) ) + 1;
  
  var tx = (server_store[key].map_size_x - 1)/2;
  var ty = (server_store[key].map_size_y - 1)/2;
  
  if(cx == tx){
    cx -= 1;
  }
  
  if(cy == ty){
    cy -= 1;
  }
  
  var hx = tx + (tx - cx);
  var hy = ty + (ty - cy);
  
  server_store[key].cool_x = cx;
  server_store[key].cool_y = cy;
  server_store[key].hot_x = hx;
  server_store[key].hot_y = hy;
  
  server_store[key].map_data[cy][cx] = 3;
  server_store[key].map_data[hy][hx] = 4;
  
  var px;
  var py;
  var bx;
  var by;
  
  if(server_store[key].auto_symmetry){
    if((server_store[key].auto_point + server_store[key].auto_block)%2 == 1){
      if(server_store[key].auto_point%2 == 1){
        server_store[key].map_data[ty][tx] = 2;
        server_store[key].auto_point -= 1;
      }
      else{
        server_store[key].map_data[ty][tx] = 1;
        server_store[key].auto_block -= 1;
      }
    }
    
    if(server_store[key].auto_point%2 == 1){
      while(1){
        px = Math.floor( Math.random() * (server_store[key].map_size_x - 3) ) + 1;
        py = Math.floor( Math.random() * (server_store[key].map_size_y - 3) ) + 1;
        
        if(!(px == tx) && !(py == ty)){
          if(server_store[key].map_data[py][px] == 0){
            if((px < cx-1 || px > cx+1 || py < cy-1 || py > cy+1) && (px < hx-1 || px > hx+1 || py < hy-1 || py > hy+1)){
              server_store[key].map_data[py][px] == 2;
              server_store[key].map_data[ty+(ty-py)][tx+(tx-px)] == 1;
              server_store[key].auto_point -= 1;
              server_store[key].auto_block -= 1;
              break;
            }
          }
        }
      }
    }
    
    for(var i=0; i < (server_store[key].auto_point)/2; i++){
      while(1){
        px = Math.floor( Math.random() * server_store[key].map_size_x);
        py = Math.floor( Math.random() * server_store[key].map_size_y);
        
        if(!(px == tx) && !(py == ty)){
          if(server_store[key].map_data[py][px] == 0){
            if((px < cx-1 || px > cx+1 || py < cy-1 || py > cy+1) && (px < hx-1 || px > hx+1 || py < hy-1 || py > hy+1)){
              server_store[key].map_data[py][px] = 2;
              server_store[key].map_data[ty+(ty-py)][tx+(tx-px)] = 2;
              break;
            }
          }
        }
      }
    }
    
    for(var i=0; i < (server_store[key].auto_block)/2; i++){
      while(1){
        bx = Math.floor( Math.random() * (server_store[key].map_size_x - 3) ) + 1;
        by = Math.floor( Math.random() * (server_store[key].map_size_y - 3) ) + 1;
        
        if(!(bx == tx) && !(by == ty)){
          if(server_store[key].map_data[by][bx] == 0){
            if((bx < cx-1 || bx > cx+1 || by < cy-1 || by > cy+1) && (bx < hx-1 || bx > hx+1 || by < hy-1 || by > hy+1)){
              server_store[key].map_data[by][bx] = 1;
              server_store[key].map_data[ty+(ty-by)][tx+(tx-bx)] = 1;
              break;
            }
          }
        }
      }
    }

  }
  else{
    for(var i=0; i < server_store[key].auto_point; i++){
      while(1){
        px = Math.floor( Math.random() * server_store[key].map_size_x);
        py = Math.floor( Math.random() * server_store[key].map_size_y);
        
        if(!(px == tx) && !(py == ty)){
          if(server_store[key].map_data[py][px] == 0){
            if((px < cx-1 || px > cx+1 || py < cy-1 || py > cy+1) && (px < hx-1 || px > hx+1 || py < hy-1 || py > hy+1)){
              server_store[key].map_data[py][px] = 2;
              break;
            }
          }
        }
      }
    }
    
    for(var i=0; i < server_store[key].auto_block; i++){
      while(1){
        bx = Math.floor( Math.random() * (server_store[key].map_size_x - 3) ) + 1;
        by = Math.floor( Math.random() * (server_store[key].map_size_y - 3) ) + 1;
        
        if(!(bx == tx) && !(by == ty)){
          if(server_store[key].map_data[by][bx] == 0){
            if((bx < cx-1 || bx > cx+1 || by < cy-1 || by > cy+1) && (bx < hx-1 || bx > hx+1 || by < hy-1 || by > hy+1)){
              server_store[key].map_data[by][bx] = 1;
              break;
            }
          }
        }
      }
    }    
  }
  
}




for(var key in server_store){
  if(!server_store[key].map_data.length){
    create_map(key);
  }
}

io.on('connection',function(socket){
  console.log('connected');
  
  socket.on('player_join', function(msg) {
    
    var people_num = Object.values(store).filter( function( value ) {
      return value.room === msg.room_id;
    });
    
    if(server_store[msg.room_id].vs == "user"){
      if(people_num.length < 2){
        var usrobj = {
          "room": msg.room_id,
          "name": msg.name,
          "chara": people_num.length
        };
        store[socket.id] = usrobj;
        socket.join(msg.room_id);
        
        if(people_num.length == 0){
          server_store[msg.room_id].cool_score = 0;
          server_store[msg.room_id].cool_name = usrobj.name;
          io.to(store[socket.id].room).emit("join_room", {
            "x_size":server_store[msg.room_id].map_size_x,
            "y_size":server_store[msg.room_id].map_size_y,
            "cool_name":server_store[msg.room_id].cool_name
          });
        }
        else{
          server_store[msg.room_id].hot_score = 0;
          server_store[msg.room_id].hot_name = usrobj.name;
          io.in(store[socket.id].room).emit("join_room", {
            "x_size":server_store[msg.room_id].map_size_x,
            "y_size":server_store[msg.room_id].map_size_y,
            "cool_name":server_store[msg.room_id].cool_name,
            "hot_name":server_store[msg.room_id].hot_name
          });
        }
        
        
        if(people_num.length == 1){
          io.in(store[socket.id].room).emit("start_game");
          
          server_store[msg.room_id].play = true;
          //server_store[msg.room_id].effect =
          
          io.in(store[socket.id].room).emit("updata_board",{
            "map_data":server_store[msg.room_id].map_data,
            "cool_score":server_store[msg.room_id].cool_score,
            "hot_score":server_store[msg.room_id].hot_score,
            "turn":server_store[msg.room_id].turn
          });
          
          socket.broadcast.to(store[socket.id].room).emit("you_turn",{
            "x":server_store[msg.room_id].cool_x,
            "y":server_store[msg.room_id].cool_y,
            "map_data":server_store[msg.room_id].map_data
          });
        }
      }
      else{
        console.log( "_error" );
        io.to(socket.id).emit("error", "接続先サーバーは満室です");
      }
    }
    else{
      if(people_num.length < 1){
        var usrobj = {
          "room": msg.room_id,
          "name": msg.name,
          "chara": people_num.length
        };
        store[socket.id] = usrobj;
        socket.join(msg.room_id);
        
        if(people_num.length == 0){
          server_store[msg.room_id].cool_score = 0;
          server_store[msg.room_id].hot_score = 0;
          server_store[msg.room_id].cool_name = usrobj.name;
          server_store[msg.room_id].hot_name = "CPU";
          io.to(store[socket.id].room).emit("join_room", {
            "x_size":server_store[msg.room_id].map_size_x,
            "y_size":server_store[msg.room_id].map_size_y,
            "cool_name":server_store[msg.room_id].cool_name,
            "cpu_name":server_store[msg.room_id].hot_name
          });
          
          io.in(store[socket.id].room).emit("start_game");
          
          io.in(store[socket.id].room).emit("updata_board",{
            "map_data":server_store[msg.room_id].map_data,
            "cool_score":server_store[msg.room_id].cool_score,
            "hot_score":server_store[msg.room_id].hot_score,
            "turn":server_store[msg.room_id].turn,
            "effect":{"t":"r","p":"hot"}
          });
          
          socket.broadcast.to(store[socket.id].room).emit("you_turn",
            {"x":server_store[msg.room_id].cool_x,
             "y":server_store[msg.room_id].cool_y,
             "map_data":server_store[msg.room_id].map_data
          });
        }
      }
      else{
        console.log( "_error" );
        io.to(socket.id).emit("error", "接続先サーバーは満室です");
      }
    }

  });
  
  socket.on('move_player', function(msg) {
    if(store[socket.id].chara == 0){
      var c_x = server_store[store[socket.id].room].cool_x;
      var c_y = server_store[store[socket.id].room].cool_y;
      var winer = false;
      
      
      if(server_store[store[socket.id].room].map_data[c_y][c_x] == 34 || server_store[store[socket.id].room].map_data[c_y][c_x] == 43){
        server_store[store[socket.id].room].map_data[c_y][c_x] = 4;
      }
      else{
        server_store[store[socket.id].room].map_data[c_y][c_x] = 0;
      }
      
      if(msg === "top"){
        if(0 <= c_y - 1){
          server_store[store[socket.id].room].cool_y = c_y - 1;
          c_y = c_y - 1;
        }
        else{
          winer = "hot";
        }
      }
      else if(msg === "bottom"){
        if(server_store[store[socket.id].room].map_size_y > c_y + 1){
          server_store[store[socket.id].room].cool_y = c_y + 1;
          c_y = c_y + 1;
        }
        else{
          winer = "hot";
        }
      }
      else if(msg === "left"){
        if(0 <= c_x - 1){
          server_store[store[socket.id].room].cool_x = c_x - 1;
          c_x = c_x - 1;
        }
        else{
          winer = "hot";
        }
      }
      else{
        if(server_store[store[socket.id].room].map_size_x > c_x + 1){
          server_store[store[socket.id].room].cool_x = c_x + 1;
          c_x = c_x + 1;
        }
        else{
          winer = "hot";
        }
      }
      
      if(!winer){
        if(server_store[store[socket.id].room].map_data[c_y][c_x] == 1){
          winer = "hot";
        }
        else if(server_store[store[socket.id].room].map_data[c_y][c_x] == 2){
          server_store[store[socket.id].room].map_data[c_y][c_x] = 3;
          server_store[store[socket.id].room].cool_score += 1;
          
          
          if(msg === "top"){
            if(server_store[store[socket.id].room].map_data[c_y + 1][c_x] == 4){
              winer = "cool";
            }
            server_store[store[socket.id].room].map_data[c_y + 1][c_x] = 1;
          }
          else if(msg === "bottom"){
            if(server_store[store[socket.id].room].map_data[c_y - 1][c_x] == 4){
              winer = "cool";
            }
            server_store[store[socket.id].room].map_data[c_y - 1][c_x] = 1;
          }
          else if(msg === "left"){
            if(server_store[store[socket.id].room].map_data[c_y][c_x + 1] == 4){
              winer = "cool";
            }
            server_store[store[socket.id].room].map_data[c_y][c_x + 1] = 1;
          }
          else{
            if(server_store[store[socket.id].room].map_data[c_y][c_x - 1] == 4){
              winer = "cool";
            }
            server_store[store[socket.id].room].map_data[c_y][c_x - 1] = 1;
          }
          
        }
        else if(server_store[store[socket.id].room].map_data[c_y][c_x] == 4){
          server_store[store[socket.id].room].map_data[c_y][c_x] = 34;
        }
        else{
          server_store[store[socket.id].room].map_data[c_y][c_x] = 3;
        }
      }   
      
      io.in(store[socket.id].room).emit("updata_board",{
        "map_data":server_store[store[socket.id].room].map_data,
        "cool_score":server_store[store[socket.id].room].cool_score,
        "hot_score":server_store[store[socket.id].room].hot_score,
        "turn":server_store[store[socket.id].room].turn,
        "effect":{"t":"r","p":"cool"}
      });
      
      game_result_check(socket,winer);
      
    }
    else if(store[socket.id].chara == 1){
      var h_x = server_store[store[socket.id].room].hot_x;
      var h_y = server_store[store[socket.id].room].hot_y;
      
      var winer = false;
      
      
      if(server_store[store[socket.id].room].map_data[h_y][h_x] == 34 || server_store[store[socket.id].room].map_data[h_y][h_x] == 43){
        server_store[store[socket.id].room].map_data[h_y][h_x] = 3;
      }
      else{
        server_store[store[socket.id].room].map_data[h_y][h_x] = 0;
      }
      
      if(msg === "top"){
        if(0 <= h_y - 1){
          server_store[store[socket.id].room].hot_y = h_y - 1;
          h_y = h_y - 1;
        }
        else{
          winer = "cool";
        }
      }
      else if(msg === "bottom"){
        if(server_store[store[socket.id].room].map_size_y > h_y + 1){
          server_store[store[socket.id].room].hot_y = h_y + 1;
          h_y = h_y + 1;
        }
        else{
          winer = "cool";
        }
      }
      else if(msg === "left"){
        if(0 <= h_x - 1){
          server_store[store[socket.id].room].hot_x = h_x - 1;
          h_x = h_x - 1;
        }
        else{
          winer = "cool";
        }
      }
      else{
        if(server_store[store[socket.id].room].map_size_x > h_x + 1){
          server_store[store[socket.id].room].hot_x = h_x + 1;
          h_x = h_x + 1;
        }
        else{
          winer = "cool";
        }
      }
      
      
      if(server_store[store[socket.id].room].map_data[h_y][h_x] == 1){
        winer = "cool";
      }
      else if(server_store[store[socket.id].room].map_data[h_y][h_x] == 2){
        server_store[store[socket.id].room].map_data[h_y][h_x] = 4;
        server_store[store[socket.id].room].hot_score += 1;
        
        
        if(msg === "top"){
          if(server_store[store[socket.id].room].map_data[h_y + 1][h_x] == 4){
            winer = "hot";
          }
          server_store[store[socket.id].room].map_data[h_y + 1][h_x] = 1;
        }
        else if(msg === "bottom"){
          if(server_store[store[socket.id].room].map_data[h_y - 1][h_x] == 4){
            winer = "hot";
          }
          server_store[store[socket.id].room].map_data[h_y - 1][h_x] = 1;
        }
        else if(msg === "left"){
          if(server_store[store[socket.id].room].map_data[h_y][h_x + 1] == 4){
            winer = "hot";
          }
          server_store[store[socket.id].room].map_data[h_y][h_x + 1] = 1;
        }
        else{
          if(server_store[store[socket.id].room].map_data[h_y][h_x - 1] == 4){
            winer = "hot";
          }
          server_store[store[socket.id].room].map_data[h_y][h_x - 1] = 1;
        }
        
      }
      else if(server_store[store[socket.id].room].map_data[h_y][h_x] == 3){
        server_store[store[socket.id].room].map_data[h_y][h_x] = 43;
      }
      else{
        server_store[store[socket.id].room].map_data[h_y][h_x] = 4;
      }
      
      
      server_store[store[socket.id].room].turn -= 1;
      
      io.in(store[socket.id].room).emit("updata_board",{
        "map_data":server_store[store[socket.id].room].map_data,
        "cool_score":server_store[store[socket.id].room].cool_score,
        "hot_score":server_store[store[socket.id].room].hot_score,
        "turn":server_store[store[socket.id].room].turn,
        "effect":{"t":"r","p":"hot"}
      });

      game_result_check(socket,winer);
      
    }
  });
  
  
  socket.on('look', function(msg) {
    
    if(store[socket.id].chara == 0){
      
      io.in(store[socket.id].room).emit("updata_board",{
        "map_data":server_store[store[socket.id].room].map_data,
        "cool_score":server_store[store[socket.id].room].cool_score,
        "hot_score":server_store[store[socket.id].room].hot_score,
        "turn":server_store[store[socket.id].room].turn,
        "effect": {"t":"l","d":msg.effect,"p":"cool"}
      });
      
      game_result_check(socket,false);
      
    }
    else if(store[socket.id].chara == 1){
      server_store[store[socket.id].room].turn -= 1;
      
      io.in(store[socket.id].room).emit("updata_board",{
        "map_data":server_store[store[socket.id].room].map_data,
        "cool_score":server_store[store[socket.id].room].cool_score,
        "hot_score":server_store[store[socket.id].room].hot_score,
        "turn":server_store[store[socket.id].room].turn,
        "effect":{"t":"l","d":msg.effect,"p":"hot"}
      });
      
      game_result_check(socket,false);
      
    }
    
  });
  

  socket.on('search', function(msg) {
    if(store[socket.id].chara == 0){
      io.in(store[socket.id].room).emit("updata_board",{
        "map_data":server_store[store[socket.id].room].map_data,
        "cool_score":server_store[store[socket.id].room].cool_score,
        "hot_score":server_store[store[socket.id].room].hot_score,
        "turn":server_store[store[socket.id].room].turn,
        "effect":{"t":"s","d":msg.effect,"p":"cool"}
      });
      
      game_result_check(socket,false);
      
    }
    else if(store[socket.id].chara == 1){
      server_store[store[socket.id].room].turn -= 1;
      
      io.in(store[socket.id].room).emit("updata_board",{
        "map_data":server_store[store[socket.id].room].map_data,
        "cool_score":server_store[store[socket.id].room].cool_score,
        "hot_score":server_store[store[socket.id].room].hot_score,
        "turn":server_store[store[socket.id].room].turn,
        "effect":{"t":"s","d":msg.effect,"p":"hot"}
      });
      
      game_result_check(socket,false);
      
    }
  });
  
  socket.on('put_wall', function(msg) {
    if(store[socket.id].chara == 0){
      var c_x = server_store[store[socket.id].room].cool_x;
      var c_y = server_store[store[socket.id].room].cool_y;
      
      var winer = false;
      var put_check = 0;
      
      if(msg === "top"){
        if(0 <= c_y - 1){
          c_y = c_y - 1;
          put_check = 1;
        }
      }
      else if(msg === "bottom"){
        if(server_store[store[socket.id].room].map_size_y > c_y + 1){
          c_y = c_y + 1;
          put_check = 1;
        }
      }
      else if(msg === "left"){
        if(0 <= c_x - 1){
          c_x = c_x - 1;
          put_check = 1;
        }
      }
      else{
        if(server_store[store[socket.id].room].map_size_x > c_x + 1){
          c_x = c_x + 1;
          put_check = 1;
        }
      }
      
      if(put_check == 1 && server_store[store[socket.id].room].map_data[c_y][c_x] == 4){
        winer = "cool";
        server_store[store[socket.id].room].map_data[c_y][c_x] = 1;
      }
      else if(put_check == 1 && server_store[store[socket.id].room].map_data[c_y][c_x] == 34){
        winer = "draw";
        server_store[store[socket.id].room].map_data[c_y][c_x] = 1;
      }
      else if(put_check == 1 && server_store[store[socket.id].room].map_data[c_y][c_x] == 43){
        winer = "draw";
        server_store[store[socket.id].room].map_data[c_y][c_x] = 1;
      }
      else if(put_check == 1){
        server_store[store[socket.id].room].map_data[c_y][c_x] = 1;
      }
      
      io.in(store[socket.id].room).emit("updata_board",{
        "map_data":server_store[store[socket.id].room].map_data,
        "cool_score":server_store[store[socket.id].room].cool_score,
        "hot_score":server_store[store[socket.id].room].hot_score,
        "turn":server_store[store[socket.id].room].turn,
        "effect":{"t":"r","p":"cool"}
      });
      
      
      game_result_check(socket,winer);
      
    }
    else if(store[socket.id].chara == 1){
      var h_x = server_store[store[socket.id].room].hot_x;
      var h_y = server_store[store[socket.id].room].hot_y;
      
      var winer = false;
      var put_check = 0;
      
      
      if(msg === "top"){
        if(0 <= h_y - 1){
          h_y = h_y - 1;
          put_check = 1;
        }
      }
      else if(msg === "bottom"){
        if(server_store[store[socket.id].room].map_size_y > h_y + 1){
          h_y = h_y + 1;
          put_check = 1;
        }
      }
      else if(msg === "left"){
        if(0 <= h_x - 1){
          h_x = h_x - 1;
          put_check = 1;
        }
      }
      else{
        if(server_store[store[socket.id].room].map_size_x > h_x + 1){
          h_x = h_x + 1;
          put_check = 1;
        }
      }


      if(put_check == 1 && server_store[store[socket.id].room].map_data[h_y][h_x] == 3){
        winer = "hot";
        server_store[store[socket.id].room].map_data[h_y][h_x] = 1;
      }
      else if(put_check == 1 && server_store[store[socket.id].room].map_data[h_y][h_x] == 34){
        winer = "draw";
        server_store[store[socket.id].room].map_data[h_y][h_x] = 1;
      }
      else if(put_check == 1 && server_store[store[socket.id].room].map_data[h_y][h_x] == 43){
        winer = "draw";
        server_store[store[socket.id].room].map_data[h_y][h_x] = 1;
      }
      else if(put_check == 1){
        server_store[store[socket.id].room].map_data[h_y][h_x] = 1;
      }
      
      server_store[store[socket.id].room].turn -= 1;
      
      io.in(store[socket.id].room).emit("updata_board",{
        "map_data":server_store[store[socket.id].room].map_data, 
        "cool_score":server_store[store[socket.id].room].cool_score,
        "hot_score":server_store[store[socket.id].room].hot_score,
        "turn":server_store[store[socket.id].room].turn,
        "effect":{"t":"r","p":"hot"}
      });

      
      game_result_check(socket,winer);
      
    }
  });


  socket.on('disconnect', function() {
    if (store[socket.id]) {
      var _roomid = store[socket.id].room;
      
      if(server_store[store[socket.id].room].play){
        if(store[socket.id].chara == 0){
          game_result_check(socket,"hot");
        }
        else{
          game_result_check(socket,"cool");
        }
      }
      
      socket.leave(_roomid);
      delete store[socket.id];
      
      var people_num = Object.values(store).filter( function( value ) {
        return value.room === _roomid;
      });
      
      if(people_num.length == 0){
        server_store[_roomid] = JSON.parse(JSON.stringify(game_server[_roomid]));
        if(!server_store[_roomid].map_data.length){
          create_map(_roomid);
        }
      }
    }
  });
  
  
  socket.on('leave_room', function() {
    if (store[socket.id]) {
      var _roomid = store[socket.id].room;
      
      if(server_store[store[socket.id].room].play){
        if(store[socket.id].chara == 0){
          game_result_check(socket,"hot");
        }
        else{
          game_result_check(socket,"cool");
        }
      }
      
      socket.leave(_roomid);
      delete store[socket.id];
      
      var people_num = Object.values(store).filter( function( value ) {
        return value.room === _roomid;
      });
      
      if(people_num.length == 0){
        server_store[_roomid] = JSON.parse(JSON.stringify(game_server[_roomid]));
        if(!server_store[_roomid].map_data.length){
          create_map(_roomid);
        }
      }
    }
  });
});


module.exports = router;