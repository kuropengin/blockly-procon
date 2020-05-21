var express = require('express');
var router = express.Router();
const logger = require('../bin/logger.js');

//socket.io
var socket_io = require('socket.io'); 
var io = socket_io();
router.io = io;


//game_server_list
var fs = require('fs');
var path = require('path');
//var game_server = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'load_data/game_server_data/server_data.json'), 'utf8'));

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


//game_server_store
var store = {};
var looker = {};
var server_store = JSON.parse(JSON.stringify(game_server));
var room_store = {};
var cpu_store = {};



//GET page
router.get('/', function(req, res, next) {
  try{
    var lg = req.cookies.lng;
    var LNG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "language", lg, "programming.json"), "utf-8"));
  }
  catch(e){
    var LNG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "language", "ja", "programming.json"), "utf-8"));
  }
  res.render('programming', { "title": 'プログラミング',"LNG":LNG});
});


//create_map
function create_map(key){
  
  var map = new Array(server_store[key].map_size_y);
  for(let y = 0; y < server_store[key].map_size_y; y++) {
    map[y] = new Array(server_store[key].map_size_x).fill(0);
  }
  
  server_store[key].map_data = map;
  
  var selectable_list = [];
  
  for(var s_x = 0; s_x < Math.floor(server_store[key].map_size_x/2)+1; s_x++){
    for(var s_y = 0; s_y < server_store[key].map_size_y; s_y++){
      if(s_y == Math.floor(server_store[key].map_size_y/2)-1 && s_x == Math.floor(server_store[key].map_size_x/2)){
        break;
      }
      else if(s_x == Math.floor(server_store[key].map_size_x/2)-1 && s_y <= Math.floor(server_store[key].map_size_y/2)+1 && s_y >= Math.floor(server_store[key].map_size_y/2)-1 ){
        continue;
      }
      else{
        selectable_list.push([s_x,s_y]);
      }
    }
  }
  
  
  
  var cxy = Math.floor(Math.random() * selectable_list.length);
  
  var cx = selectable_list[cxy][0];
  var cy = selectable_list[cxy][1];
  
  var tx = Math.floor((server_store[key].map_size_x - 1)/2);
  var ty = Math.floor((server_store[key].map_size_y - 1)/2);
  
  var hx = tx + (tx - cx);
  var hy = ty + (ty - cy);
  
  selectable_list.splice(cxy, 1);
  
  server_store[key].cool.x = cx;
  server_store[key].cool.y = cy;
  server_store[key].hot.x = hx;
  server_store[key].hot.y = hy;
  
  server_store[key].map_data[cy][cx] = 3;
  server_store[key].map_data[hy][hx] = 4;
  
  
  if(server_store[key].auto_symmetry){
    for(var add_list=0; add_list<3; add_list++){
      selectable_list.push([Math.floor(server_store[key].map_size_x/2)-1,Math.floor(server_store[key].map_size_y/2)-1+add_list]);
    }
    
    
    var selectable_list_temp = selectable_list;
    selectable_list = [];
    
    for(var list_data=0; list_data<selectable_list_temp.length; list_data++){
      if((selectable_list_temp[list_data][0] >= cx-1 && selectable_list_temp[list_data][0] <= cx+1 && selectable_list_temp[list_data][1] >= cy-1 && selectable_list_temp[list_data][1] <= cy+1)){
        continue;
      }
      else{
        selectable_list.push( [selectable_list_temp[list_data][0],selectable_list_temp[list_data][1]] );
      }
    }
    
    
    if(server_store[key].auto_point%2 == 0){
      if(server_store[key].auto_point == 1){
        server_store[key].auto_point += 1;
      }
      else{
        server_store[key].auto_point -= 1;
      }
    }
    
    if(server_store[key].auto_block%2 == 1){
      if(server_store[key].auto_block == 1){
        server_store[key].auto_block += 1;
      }
      else{
        server_store[key].auto_block -= 1;
      }
    }
    server_store[key].map_data[ty][tx] = 2;
    server_store[key].auto_point -= 1;
  }
  else{
    selectable_list = [];
    for(var s_x = 0; s_x < server_store[key].map_size_x; s_x++){
      for(var s_y = 0; s_y < server_store[key].map_size_y; s_y++){
        if((s_x < cx-1 || s_x > cx+1 || s_y < cy-1 || s_y > cy+1) && (s_x < hx-1 || s_x > hx+1 || s_y < hy-1 || s_y > hy+1)){
          selectable_list.push([s_x,s_y]);
        }
      }
    }
  }
  
  var pxy
  var px;
  var py;
  var bxy
  var bx;
  var by;
  
  if(server_store[key].auto_symmetry){
    for(var i=0; i < server_store[key].auto_point/2; i++){
      pxy = Math.floor(Math.random() * selectable_list.length);
      px = selectable_list[pxy][0];
      py = selectable_list[pxy][1];
      
      server_store[key].map_data[py][px] = 2;
      server_store[key].map_data[ty+(ty-py)][tx+(tx-px)] = 2;
      
      selectable_list.splice(pxy, 1);
    }
  }
  else{
    for(var i=0; i < server_store[key].auto_point; i++){
      pxy = Math.floor(Math.random() * selectable_list.length);
      px = selectable_list[pxy][0];
      py = selectable_list[pxy][1];
      
      server_store[key].map_data[py][px] = 2;
      
      selectable_list.splice(pxy, 1);
    }
  }
  
  
  var selectable_list_temp = selectable_list;
  selectable_list = [];
  for(var list_data=0; list_data<selectable_list_temp.length; list_data++){
    if(selectable_list_temp[list_data][0] < 1 || selectable_list_temp[list_data][0] > server_store[key].map_size_x-2 || selectable_list_temp[list_data][1] < 1 || selectable_list_temp[list_data][1] > server_store[key].map_size_y-2){
      continue;
    }
    else if((selectable_list_temp[list_data][0] == cx && (selectable_list_temp[list_data][1] == cy + 9 || selectable_list_temp[list_data][1] == cy - 9)) || (selectable_list_temp[list_data][0] == hx && (selectable_list_temp[list_data][1] == hy + 9 || selectable_list_temp[list_data][1] == hy - 9))){
      continue;
    }
    else{
      selectable_list.push( [selectable_list_temp[list_data][0] , selectable_list_temp[list_data][1]] );
    }
  }
  
  
  if(server_store[key].auto_symmetry){
    for(var i=0; i < server_store[key].auto_block/2; i++){
      bxy = Math.floor(Math.random() * selectable_list.length);
      bx = selectable_list[bxy][0];
      by = selectable_list[bxy][1];
      
      server_store[key].map_data[by][bx] = 1;
      server_store[key].map_data[ty+(ty-by)][tx+(tx-bx)] = 1;
      
      selectable_list.splice(bxy, 1);
    }
  }
  else{
    for(var i=0; i < server_store[key].auto_block; i++){
      bxy = Math.floor(Math.random() * selectable_list.length);
      bx = selectable_list[bxy][0];
      by = selectable_list[bxy][1];
      
      server_store[key].map_data[by][bx] = 1;
      
      selectable_list.splice(bxy, 1);
    }
  }
  
}
for(var key in server_store){
  if(!server_store[key].map_data.length){
    create_map(key);
  }
}


//cpu

function cpu(room,level,chara){
  
  var cpu_map_date = get_ready(room,chara);
  const delay_time = 100;
  
  if(cpu_map_date){
    if(level == 0){
      setTimeout(look, delay_time, room,chara,"top");
    }
    else if(level == 1){
      var random_list = [];
      if(cpu_map_date[1] != 2){
        random_list.push('top');
      }
      if(cpu_map_date[3] != 2){
        random_list.push('left');
      }
      if(cpu_map_date[5] != 2){
        random_list.push('right');
      }
      if(cpu_map_date[7] != 2){
        random_list.push('bottom');
      }
      
      if(random_list){
        var random = Math.floor( Math.random() * random_list.length );
        setTimeout(move_player, delay_time, room, chara, random_list[random]);
      }
      else{
        setTimeout(look, delay_time, room,chara,"top");
      }
    }
  }
}

function game_time_out(room,winer){
  io.in(room).emit("game_result",{
      "winer": winer
    });
  game_server_reset(room);
}

function game_result_check(room,chara,effect_t = "r",effect_d = false,winer = false){
  
  clearTimeout(server_store[room].timer);
  
  var effect_chara = {"cool":"hot","hot":"cool"};
  
  if(chara == "hot"){
    server_store[room].turn -= 1;
  }
  
  var effect = {
    "t":effect_t,
    "p":chara
  }
  
  if(effect_d){
    effect.d = effect_d;
  }
  
  io.in(room).emit("updata_board",{
    "map_data":server_store[room].map_data,
    "cool_score":server_store[room].cool.score,
    "hot_score":server_store[room].hot.score,
    "turn":server_store[room].turn,
    "effect":effect
  });
  
  if(!winer){
    if(server_store[room].turn == 0){
      if(server_store[room].cool.score > server_store[room].hot.score){
        winer = "cool";
      }
      else if(server_store[room].cool.score < server_store[room].hot.score){
        winer = "hot";
      }
      else{
        winer = "draw";
      }
    }
    else{
      
      var rcx = server_store[room].cool.x;
      var rcy = server_store[room].cool.y;
      var rhx = server_store[room].hot.x;
      var rhy = server_store[room].hot.y;
      
      if(server_store[room].map_data[rcy][rcx] != 34 && server_store[room].map_data[rcy][rcx] != 3 && server_store[room].map_data[rhy][rhx] != 4){
        winer = "draw";
      }
      else if(server_store[room].map_data[rcy][rcx] != 34 && server_store[room].map_data[rcy][rcx] != 3){
        winer = "hot";
      }
      else if(server_store[room].map_data[rcy][rcx] != 34 && server_store[room].map_data[rhy][rhx] != 4){
        winer = "cool";
      }
      else{
        var c_t,c_b,c_r,c_l,h_t,h_b,h_r,h_l;
        
        if(rcx - 1 < 0){
          c_l = 1;
          c_r = server_store[room].map_data[rcy][rcx + 1];
        }
        else if(rcx + 1 > server_store[room].map_size_x - 1){
          c_l = server_store[room].map_data[rcy][rcx - 1];
          c_r = 1;
        }
        else{
          c_l = server_store[room].map_data[rcy][rcx - 1];
          c_r = server_store[room].map_data[rcy][rcx + 1];
        }
        
        if(rcy - 1 < 0){
          c_t = 1;
          c_b = server_store[room].map_data[rcy + 1][rcx];
        }
        else if(rcy + 1 > server_store[room].map_size_y - 1){
          c_t = server_store[room].map_data[rcy - 1][rcx];
          c_b = 1;
        }
        else{
          c_t = server_store[room].map_data[rcy - 1][rcx];
          c_b = server_store[room].map_data[rcy + 1][rcx];
        }
        
        
        if(rhx - 1 < 0){
          h_l = 1;
          h_r = server_store[room].map_data[rhy][rhx + 1];
        }
        else if(rhx + 1 > server_store[room].map_size_x - 1){
          h_l = server_store[room].map_data[rhy][rhx - 1];
          h_r = 1;
        }
        else{
          h_l = server_store[room].map_data[rhy][rhx - 1];
          h_r = server_store[room].map_data[rhy][rhx + 1];
        }
        
        if(rhy - 1 < 0){
          h_t = 1;
          h_b = server_store[room].map_data[rhy + 1][rhx];
        }
        else if(rhy + 1 > server_store[room].map_size_y - 1){
          h_t = server_store[room].map_data[rhy - 1][rhx];
          h_b = 1;
        }
        else{
          h_t = server_store[room].map_data[rhy - 1][rhx];
          h_b = server_store[room].map_data[rhy + 1][rhx];
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
      }
    }
  }
  if(winer){
    io.in(room).emit("game_result",{
      "winer": winer
    });
    game_server_reset(room);
  }
  else{
    server_store[room][effect_chara[chara]].turn = true;
    
    if(server_store[room].timeout){
      server_store[room].timer = setTimeout(game_time_out, 1000 * server_store[room].timeout, room, chara);
    }
    else{
      server_store[room].timer = setTimeout(game_time_out, 10000, room, chara);
    }
    
    if(server_store[room].cpu && server_store[room][server_store[room].cpu.turn].turn){
      cpu(room,server_store[room].cpu.level,server_store[room].cpu.turn);
    }
  }
  
}

function game_server_reset(room){
  for(var user_id in store){
    if(store[user_id].room == room){
      if(io.sockets.sockets[user_id]){
        io.sockets.sockets[user_id].leave(room);
      }
      delete store[user_id];
    }
  }
  server_store[room] = JSON.parse(JSON.stringify(game_server[room]));
  if(!server_store[room].map_data.length){
    create_map(room);
  }
}


//player action
function get_ready(room,chara,id=false){
  if(server_store[room][chara].turn && server_store[room][chara].getready){
    var my_map_data = [];
    var tmp_map_data = Array.from(server_store[room].map_data);
    var now_x = server_store[room][chara].x;
    var now_y = server_store[room][chara].y;
    var load_map_size_x = server_store[room].map_size_x;
    var load_map_size_y = server_store[room].map_size_y;
    
    
    for(var y of [-1,0,1]){
      if(0 > (now_y + y) || (load_map_size_y - 1) < (now_y + y)){
          for(var x of [-1,0,1]){
              my_map_data.push(2);
          }
      }
      else{
          for(var x of [-1,0,1]){
              if(0 > (now_x + x) || (load_map_size_x - 1) < (now_x + x)){
                  my_map_data.push(2);
              }
              else{
                  if(tmp_map_data[now_y][now_x] == 3){
                      if(tmp_map_data[now_y + y][now_x + x] == 3){
                          my_map_data.push(0); 
                      }
                      else if(tmp_map_data[now_y + y][now_x + x] == 4){
                          my_map_data.push(1); 
                      }
                      else{
                        if(tmp_map_data[now_y + y][now_x + x] == 0){
                          my_map_data.push(tmp_map_data[now_y + y][now_x + x]);
                        }
                        else if(tmp_map_data[now_y + y][now_x + x] == 1){
                          my_map_data.push(2);
                        }
                        else{
                          my_map_data.push(3);
                        }
                      }
                  }
                  else if(tmp_map_data[now_y][now_x] == 4){
                      if(tmp_map_data[now_y + y][now_x + x] == 3){
                          my_map_data.push(1); 
                      }
                      else if(tmp_map_data[now_y + y][now_x + x] == 4){
                          my_map_data.push(0); 
                      }
                      else{
                        if(tmp_map_data[now_y + y][now_x + x] == 0){
                          my_map_data.push(tmp_map_data[now_y + y][now_x + x]);
                        }
                        else if(tmp_map_data[now_y + y][now_x + x] == 1){
                          my_map_data.push(2);
                        }
                        else{
                          my_map_data.push(3);
                        }
                      }
                  }
                  else{
                      if(tmp_map_data[now_y + y][now_x + x] == 43 || tmp_map_data[now_y + y][now_x + x] == 34){
                          my_map_data.push(1); 
                      }
                      else{
                        if(tmp_map_data[now_y + y][now_x + x] == 0){
                          my_map_data.push(tmp_map_data[now_y + y][now_x + x]);
                        }
                        else if(tmp_map_data[now_y + y][now_x + x] == 1){
                          my_map_data.push(2);
                        }
                        else{
                          my_map_data.push(3);
                        } 
                      } 
                  }
              }
          }
      }
    }
    if(id){
      io.to(id).emit('get_ready_rec',{
        "rec_data":my_map_data
      });
      server_store[room][chara].getready = false;
    }
    else{
      server_store[room][chara].getready = false;
      return my_map_data;
    }
  }
  else{
    if(id){
      io.to(id).emit('get_ready_rec',{
        "rec_data":server_store[room][chara].true
      });
    }
    else{
      return false;
    }
  }  
}

function move_player(room,chara,msg,id=false){
  if(server_store[room][chara].turn && server_store[room][chara].getready == false){
    server_store[room][chara].turn = false;
    server_store[room][chara].getready = true;
    var x = server_store[room][chara].x;
    var y = server_store[room][chara].y;
    
    var xy_check = false;
    var chara_num = {"cool":3,"hot":4};
    var chara_num_diff = {"cool":4,"hot":3};
    
    var move_map_data = [];
    
    if(server_store[room].map_data[y][x] == 34){
      server_store[room].map_data[y][x] = chara_num_diff[chara];
    }
    else{
      server_store[room].map_data[y][x] = 0;
    }
    
    if(msg === "top"){
      if(0 <= y - 1){
        server_store[room][chara].y = y - 1;
        y = y - 1;
        xy_check = true;
      }
    }
    else if(msg === "bottom"){
      if(server_store[room].map_size_y > y + 1){
        server_store[room][chara].y = y + 1;
        y = y + 1;
        xy_check = true;
      }
    }
    else if(msg === "left"){
      if(0 <= x - 1){
        server_store[room][chara].x = x - 1;
        x = x - 1;
        xy_check = true;
      }
    }
    else{
      if(server_store[room].map_size_x > x + 1){
        server_store[room][chara].x = x + 1;
        x = x + 1;
        xy_check = true;
      }
    }
    
    if(xy_check){
      if(server_store[room].map_data[y][x] == 0){
        server_store[room].map_data[y][x] = chara_num[chara];
      }
      else if(server_store[room].map_data[y][x] == 2){
        server_store[room].map_data[y][x] = chara_num[chara];
        server_store[room][chara].score += 1;
        
        if(msg === "top"){
          server_store[room].map_data[y + 1][x] = 1;
        }
        else if(msg === "bottom"){
          server_store[room].map_data[y - 1][x] = 1;
        }
        else if(msg === "left"){
          server_store[room].map_data[y][x + 1] = 1;
        }
        else{
          server_store[room].map_data[y][x - 1] = 1;
        }
        
      }
      else if(server_store[room].map_data[y][x] == chara_num_diff[chara]){
        server_store[room].map_data[y][x] = 34;
      }
      
      var tmp_map_data = Array.from(server_store[room].map_data);
      var x_range = [-1,0,1];
      var y_range = [-1,0,1];
      var load_map_size_x = server_store[room].map_size_x;
      var load_map_size_y = server_store[room].map_size_y;
    
      for(var _y of y_range){
        for(var _x of x_range){
          if(0 > (_x + x) || (load_map_size_x - 1) < (_x + x) || 0 > (_y + y) || (load_map_size_y - 1) < (_y + y)){
            move_map_data.push(2);
          }
          else{
            if(tmp_map_data[_y + y][_x + x] == chara_num_diff[chara] || tmp_map_data[_y + y][_x + x] == 34){
              move_map_data.push(1);
            }
            else{
              if(tmp_map_data[_y + y][_x + x] == 0 || tmp_map_data[_y + y][_x + x] == chara_num[chara]){
                move_map_data.push(0);
              }
              else if(tmp_map_data[_y + y][_x + x] == 1){
                move_map_data.push(2);
              }
              else{
                move_map_data.push(3);
              } 
            } 
          }
        }
      }
      if(id){
        io.to(id).emit('move_rec',{
          "rec_data":move_map_data
        });
      }
    }   
    
    game_result_check(room,chara);
    
    if(!id){
      return move_map_data;
    }
  }
}

function look(room,chara,msg,id=false){
  if(server_store[room][chara].turn && server_store[room][chara].getready == false){
    server_store[room][chara].turn = false;
    server_store[room][chara].getready = true;
    var x_range = [];
    var y_range = [];
    
    var tmp_map_data = Array.from(server_store[room].map_data);
    var now_x = server_store[room][chara].x;
    var now_y = server_store[room][chara].y;
    var load_map_size_x = server_store[room].map_size_x;
    var load_map_size_y = server_store[room].map_size_y;
    
    var chara_num_diff = {"cool":4,"hot":3};
    
    if(msg == "top"){
      x_range = [-1,0,1];
      y_range = [-3,-2,-1];
    }else if(msg == "bottom"){
      x_range = [-1,0,1];
      y_range = [1,2,3];
    }else if(msg == "left"){
      x_range = [-3,-2,-1];
      y_range = [-1,0,1];
    }else{
      x_range = [1,2,3];
      y_range = [-1,0,1];
    }
    var look_map_data = [];
    
    for(var y of y_range){
      for(var x of x_range){
        if(0 > (now_x + x) || (load_map_size_x - 1) < (now_x + x) || 0 > (now_y + y) || (load_map_size_y - 1) < (now_y + y)){
          look_map_data.push(2);
        }
        else{
          if(tmp_map_data[now_y + y][now_x + x] == chara_num_diff[chara] || tmp_map_data[now_y + y][now_x + x] == 34){
            look_map_data.push(1);
          }
          else{
            if(tmp_map_data[now_y + y][now_x + x] == 0){
              look_map_data.push(tmp_map_data[now_y + y][now_x + x]);
            }
            else if(tmp_map_data[now_y + y][now_x + x] == 1){
              look_map_data.push(2);
            }
            else{
              look_map_data.push(3);
            } 
          } 
        }
      }
    }
    if(id){
      io.to(id).emit('look_rec',{
        "rec_data":look_map_data
      });
      game_result_check(room,chara,"l",msg);
    }
    else{
      game_result_check(room,chara,"l",msg);
      return look_map_data;
    }
  }
  else{
    if(id){
      io.to(id).emit('look_rec',{
        "rec_data":server_store[room][chara].true
      });
    }
    else{
      return false;
    }
  }
}

function search(room,chara,msg,id=false){
  if(server_store[room][chara].turn && server_store[room][chara].getready == false){
    server_store[room][chara].turn = false;
    server_store[room][chara].getready = true;
    var x_range = [];
    var y_range = [];
    
    var tmp_map_data = Array.from(server_store[room].map_data);
    var now_x = server_store[room][chara].x;
    var now_y = server_store[room][chara].y;
    var load_map_size_x = server_store[room].map_size_x;
    var load_map_size_y = server_store[room].map_size_y;
    
    var chara_num_diff = {"cool":4,"hot":3};
    
    if(msg == "top"){
      x_range = [0];
      y_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
    }else if(msg == "bottom"){
      x_range = [0];
      y_range = [1,2,3,4,5,6,7,8,9];
    }else if(msg == "left"){
      x_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
      y_range = [0];
    }else{
      x_range = [1,2,3,4,5,6,7,8,9];
      y_range = [0];
    }
    
    var look_map_data = [];
    
    for(var y of y_range){
      for(var x of x_range){
        if(0 > (now_x + x) || (load_map_size_x - 1) < (now_x + x) || 0 > (now_y + y) || (load_map_size_y - 1) < (now_y + y)){
          look_map_data.push(2);
        }
        else{
          if(tmp_map_data[now_y + y][now_x + x] == chara_num_diff[chara] || tmp_map_data[now_y + y][now_x + x] == 34){
            look_map_data.push(1);
          }
          else{
            if(tmp_map_data[now_y + y][now_x + x] == 0){
              look_map_data.push(tmp_map_data[now_y + y][now_x + x]);
            }
            else if(tmp_map_data[now_y + y][now_x + x] == 1){
              look_map_data.push(2);
            }
            else{
              look_map_data.push(3);
            } 
          } 
        }
      }
    }
    if(id){
      io.to(id).emit('search_rec',{
        "rec_data":look_map_data
      });
      game_result_check(room,chara,"s",msg);
    }
    else{
      game_result_check(room,chara,"s",msg);
      return look_map_data;
    }
  }
  else{
    if(id){
      io.to(id).emit('search_rec',{
        "rec_data":server_store[room][chara].true
      });
    }
    else{
      return false;
    }
  }
}

function put_wall(room,chara,msg,id=false){
  if(server_store[room][chara].turn && server_store[room][chara].getready == false){
    server_store[room][chara].turn = false;
    server_store[room][chara].getready = true;
    var x = server_store[room][chara].x;
    var y = server_store[room][chara].y;
    
    var put_check = false;
    
    if(msg === "top"){
      if(0 <= y - 1){
        y = y - 1;
        put_check = true;
      }
    }
    else if(msg === "bottom"){
      if(server_store[room].map_size_y > y + 1){
        y = y + 1;
        put_check = true;
      }
    }
    else if(msg === "left"){
      if(0 <= x - 1){
        x = x - 1;
        put_check = true;
      }
    }
    else{
      if(server_store[room].map_size_x > x + 1){
        x = x + 1;
        put_check = true;
      }
    }
    
    if(put_check){
      server_store[room].map_data[y][x] = 1;
    }
    
    var tmp_map_data = Array.from(server_store[room].map_data);
    var put_map_data = [];
    var now_x = server_store[room][chara].x;
    var now_y = server_store[room][chara].y;
    var x_range = [-1,0,1];
    var y_range = [-1,0,1];
    var load_map_size_x = server_store[room].map_size_x;
    var load_map_size_y = server_store[room].map_size_y;
    
    var chara_num = {"cool":3,"hot":4};
    var chara_num_diff = {"cool":4,"hot":3};
  
    for(var _y of y_range){
      for(var _x of x_range){
        if(0 > (_x + now_x) || (load_map_size_x - 1) < (_x + now_x) || 0 > (_y + now_y) || (load_map_size_y - 1) < (_y + now_y)){
          put_map_data.push(2);
        }
        else{
          if(tmp_map_data[_y + now_y][_x + now_x] == chara_num_diff[chara] || tmp_map_data[_y + now_y][_x + now_x] == 34){
            put_map_data.push(1);
          }
          else{
            if(tmp_map_data[_y + now_y][_x + now_x] == 0 || tmp_map_data[_y + now_y][_x + now_x] == chara_num[chara]){
              put_map_data.push(0);
            }
            else if(tmp_map_data[_y + now_y][_x + now_x] == 1){
              put_map_data.push(2);
            }
            else{
              put_map_data.push(3);
            } 
          } 
        }
      }
    }
    
    if(id){
      io.to(id).emit('put_rec',{
        "rec_data":put_map_data
      });
      game_result_check(room,chara);
    }
    else{
      game_result_check(room,chara);
      return put_map_data;
    }
    
  }
}




//socket.io_on
io.on('connection',function(socket){
  
  socket.on('player_join', function(msg) {
    
    if(server_store[msg.room_id] && (!server_store[msg.room_id].cool.status || !server_store[msg.room_id].hot.status)){
      var room_chara;
      
      if(server_store[msg.room_id].cpu){
        if(server_store[msg.room_id].cpu.turn == "cool"){
          server_store[msg.room_id].cool.status = true;
          server_store[msg.room_id].cool.turn = false;
          server_store[msg.room_id].cool.getready = true;
          server_store[msg.room_id].cool.score = 0;
          server_store[msg.room_id].cool.name = "cpu";
          server_store[msg.room_id].hot.status = true;
          server_store[msg.room_id].hot.turn = false;
          server_store[msg.room_id].hot.getready = true;
          server_store[msg.room_id].hot.score = 0;
          server_store[msg.room_id].hot.name = msg.name;
          room_chara = "hot";
        }
        else{
          server_store[msg.room_id].cool.status = true;
          server_store[msg.room_id].cool.turn = false;
          server_store[msg.room_id].cool.getready = true;
          server_store[msg.room_id].cool.score = 0;
          server_store[msg.room_id].cool.name = msg.name;
          server_store[msg.room_id].hot.status = true;
          server_store[msg.room_id].hot.turn = false;
          server_store[msg.room_id].hot.getready = true;
          server_store[msg.room_id].hot.score = 0;
          server_store[msg.room_id].hot.name = "cpu";
          room_chara = "cool";
        }
      }
      else{
        if(!server_store[msg.room_id].cool.status){
          server_store[msg.room_id].cool.status = true;
          server_store[msg.room_id].cool.turn = false;
          server_store[msg.room_id].cool.getready = true;
          server_store[msg.room_id].cool.score = 0;
          server_store[msg.room_id].cool.name = msg.name;
          server_store[msg.room_id].hot.name = "接続待機中";
          room_chara = "cool";
        }
        else if(!server_store[msg.room_id].hot.status){
          server_store[msg.room_id].hot.status = true;
          server_store[msg.room_id].hot.turn = false;
          server_store[msg.room_id].hot.getready = true;
          server_store[msg.room_id].hot.score = 0;
          server_store[msg.room_id].hot.name = msg.name;
          room_chara = "hot";
        }
      }
      
      var usrobj = {
        "room": msg.room_id,
        "name": msg.name,
        "chara": room_chara 
      };
      
      store[socket.id] = usrobj;
      socket.join(msg.room_id);
      
      io.in(store[socket.id].room).emit("joined_room", {
        "x_size":server_store[msg.room_id].map_size_x,
        "y_size":server_store[msg.room_id].map_size_y,
        "cool_name":server_store[msg.room_id].cool.name,
        "hot_name":server_store[msg.room_id].hot.name
      });
      
      
      if(server_store[msg.room_id].hot.status){
        var game_start_timer = function(room){
          io.in(room).emit("new_board",{
            "map_data":server_store[room].map_data,
            "cool_score":server_store[room].cool.score,
            "hot_score":server_store[room].hot.score,
            "turn":server_store[room].turn
          });
          
          server_store[room].cool.turn = true;
          
          if(server_store[room].timeout){
            server_store[room].timer = setTimeout(game_time_out, 1000 * server_store[room].timeout, room, "hot");
          }
          else{
            server_store[room].timer = setTimeout(game_time_out, 10000, room, "hot");
          }
          
          if(server_store[room].cpu && server_store[room].cool.name == "cpu"){
            cpu(room,server_store[room].cpu.level,server_store[room].cpu.turn);
          }
        }
        setTimeout(game_start_timer, 500, store[socket.id].room);
      }
      
      //console.log("o:"+msg.name);
    }
    else if(!server_store[msg.room_id]){
      io.to(socket.id).emit("error", "サーバーIDが存在しません");
    }
    else{
      io.to(socket.id).emit("error", "接続先サーバーは満室です");
    }
    

  });
  
  socket.on('move_player', function(msg) {
    if(store[socket.id]){
      move_player(store[socket.id].room,store[socket.id].chara,msg,socket.id);
    }
  });
  
  socket.on('get_ready', function() {
    if(store[socket.id]){
      get_ready(store[socket.id].room,store[socket.id].chara,socket.id)
    }
  });
  
  socket.on('look', function(msg) {
    if(store[socket.id]){
      look(store[socket.id].room,store[socket.id].chara,msg,socket.id);
    }
  });
  
  socket.on('search', function(msg) {
    if(store[socket.id]){
      search(store[socket.id].room,store[socket.id].chara,msg,socket.id);
    }
  });
  
  socket.on('put_wall', function(msg) {
    if(store[socket.id]){
      put_wall(store[socket.id].room,store[socket.id].chara,msg,socket.id);
    }
  });
  
  
  socket.on('looker_join', function(msg) {
    console.log(msg);
    var usrobj = {
      "room": msg,
    };
    
    var cool_name = "接続待機中";
    var hot_name = "接続待機中";
    if(server_store[msg].cool.status){
      cool_name = server_store[msg].cool.name;
    }
    if(server_store[msg].hot.status){
      hot_name = server_store[msg].hot.name;
    }
    
    io.to(socket.id).emit("joined_room", {
      "x_size":server_store[msg].map_size_x,
      "y_size":server_store[msg].map_size_y,
      "cool_name":cool_name,
      "hot_name":hot_name
    });
    
    looker[socket.id] = usrobj;
    socket.join(msg);
    
  });

  socket.on('disconnect', function() {
    if (store[socket.id]) {
      if(server_store[store[socket.id].room].cool.status && server_store[store[socket.id].room].hot.status){
        if(store[socket.id].chara == "cool"){
          game_result_check(store[socket.id].room, store[socket.id].chara , "r", false, "hot");
        }
        else{
          game_result_check(store[socket.id].room, store[socket.id].chara , "r", false, "cool");
        }
      }
      else{
        game_server_reset(store[socket.id].room);
      }
    }
    else if(looker[socket.id]){
      socket.leave(looker[socket.id].room);
      delete looker[socket.id];
    }
  });
  
  
  socket.on('leave_room', function() {
    if (store[socket.id]) {
      if(server_store[store[socket.id].room].cool.status && server_store[store[socket.id].room].hot.status){
        if(store[socket.id].chara == "cool"){
          game_result_check(store[socket.id].room, store[socket.id].chara , "r", false, "hot");
        }
        else{
          game_result_check(store[socket.id].room, store[socket.id].chara , "r", false, "cool");
        }
      }
      else{
        game_server_reset(store[socket.id].room);
      }
    }
    else if(looker[socket.id]){
      socket.leave(looker[socket.id].room);
      delete looker[socket.id];
    }
  });
});


module.exports = router;