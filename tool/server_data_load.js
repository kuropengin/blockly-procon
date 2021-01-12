const fs = require('fs');
const path = require('path');
const logger = require('../bin/logger.js');

const config_load = require('../tool/config_data_load');

var mode_path = config_load.electron_conf_load();

const game_server_list = fs.readdirSync(path.join(__dirname, mode_path, '..',  "load_data", "game_server_data"));
var game_server = {};
var join_list = [];

const init = async function(){
  for(var gs of game_server_list){
    try{
        var temp_game_server = JSON.parse(fs.readFileSync(path.join(__dirname, mode_path, '..',  'load_data','game_server_data',gs), 'utf8'));
        if(temp_game_server.room_id){
            game_server[temp_game_server.room_id] = temp_game_server;
            join_list.push([temp_game_server.name,temp_game_server.room_id]);
            /*
            if("auto_block" in game_server[temp_game_server.room_id]){
              await create_map(temp_game_server.room_id);
            }
            */
        }
        else{
            logger.error('The format of the game server data is incorrect. Data to be loaded "' + gs + '"');
        }
    }
    catch(e){
        logger.error('Failed to read the game server data. Data to be loaded "' + gs + '"');
    }
  }
};

const create_map = function(key){
  
  var map = new Array(game_server[key].map_size_y);
  for(let y = 0; y < game_server[key].map_size_y; y++) {
    map[y] = new Array(game_server[key].map_size_x).fill(0);
  }
  
  game_server[key].map_data = map;
  
  var selectable_list = [];
  
  for(var s_x = 0; s_x < Math.floor(game_server[key].map_size_x/2)+1; s_x++){
    for(var s_y = 0; s_y < game_server[key].map_size_y; s_y++){
      if(s_y == Math.floor(game_server[key].map_size_y/2)-1 && s_x == Math.floor(game_server[key].map_size_x/2)){
        break;
      }
      else if(s_x == Math.floor(game_server[key].map_size_x/2)-1 && s_y <= Math.floor(game_server[key].map_size_y/2)+1 && s_y >= Math.floor(game_server[key].map_size_y/2)-1 ){
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
  
  var tx = Math.floor((game_server[key].map_size_x - 1)/2);
  var ty = Math.floor((game_server[key].map_size_y - 1)/2);
  
  var hx = tx + (tx - cx);
  var hy = ty + (ty - cy);
  
  selectable_list.splice(cxy, 1);
  
  game_server[key].cool.x = cx;
  game_server[key].cool.y = cy;
  game_server[key].hot.x = hx;
  game_server[key].hot.y = hy;
  
  game_server[key].map_data[cy][cx] = 3;
  game_server[key].map_data[hy][hx] = 4;
  
  
  if(game_server[key].auto_symmetry){
    for(var add_list=0; add_list<3; add_list++){
      selectable_list.push([Math.floor(game_server[key].map_size_x/2)-1,Math.floor(game_server[key].map_size_y/2)-1+add_list]);
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
    
    
    if(game_server[key].auto_point%2 == 0){
      if(game_server[key].auto_point == 1){
        game_server[key].auto_point += 1;
      }
      else{
        game_server[key].auto_point -= 1;
      }
    }
    
    if(game_server[key].auto_block%2 == 1){
      if(game_server[key].auto_block == 1){
        game_server[key].auto_block += 1;
      }
      else{
        game_server[key].auto_block -= 1;
      }
    }
    game_server[key].map_data[ty][tx] = 2;
    game_server[key].auto_point -= 1;
  }
  else{
    selectable_list = [];
    for(var s_x = 0; s_x < game_server[key].map_size_x; s_x++){
      for(var s_y = 0; s_y < game_server[key].map_size_y; s_y++){
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
  
  if(game_server[key].auto_symmetry){
    for(var i=0; i < game_server[key].auto_point/2; i++){
      pxy = Math.floor(Math.random() * selectable_list.length);
      px = selectable_list[pxy][0];
      py = selectable_list[pxy][1];
      
      game_server[key].map_data[py][px] = 2;
      game_server[key].map_data[ty+(ty-py)][tx+(tx-px)] = 2;
      
      selectable_list.splice(pxy, 1);
    }
  }
  else{
    for(var i=0; i < game_server[key].auto_point; i++){
      pxy = Math.floor(Math.random() * selectable_list.length);
      px = selectable_list[pxy][0];
      py = selectable_list[pxy][1];
      
      game_server[key].map_data[py][px] = 2;
      
      selectable_list.splice(pxy, 1);
    }
  }
  
  
  var selectable_list_temp = selectable_list;
  selectable_list = [];
  for(var list_data=0; list_data<selectable_list_temp.length; list_data++){
    if(selectable_list_temp[list_data][0] < 1 || selectable_list_temp[list_data][0] > game_server[key].map_size_x-2 || selectable_list_temp[list_data][1] < 1 || selectable_list_temp[list_data][1] > game_server[key].map_size_y-2){
      continue;
    }
    else if((selectable_list_temp[list_data][0] == cx && (selectable_list_temp[list_data][1] == cy + 9 || selectable_list_temp[list_data][1] == cy - 9)) || (selectable_list_temp[list_data][0] == hx && (selectable_list_temp[list_data][1] == hy + 9 || selectable_list_temp[list_data][1] == hy - 9))){
      continue;
    }
    else{
      selectable_list.push( [selectable_list_temp[list_data][0] , selectable_list_temp[list_data][1]] );
    }
  }
  
  
  if(game_server[key].auto_symmetry){
    for(var i=0; i < game_server[key].auto_block/2; i++){
      bxy = Math.floor(Math.random() * selectable_list.length);
      bx = selectable_list[bxy][0];
      by = selectable_list[bxy][1];
      
      game_server[key].map_data[by][bx] = 1;
      game_server[key].map_data[ty+(ty-by)][tx+(tx-bx)] = 1;
      
      selectable_list.splice(bxy, 1);
    }
  }
  else{
    for(var i=0; i < game_server[key].auto_block; i++){
      bxy = Math.floor(Math.random() * selectable_list.length);
      bx = selectable_list[bxy][0];
      by = selectable_list[bxy][1];
      
      game_server[key].map_data[by][bx] = 1;
      
      selectable_list.splice(bxy, 1);
    }
  }
};

const load = function(room=false){
    if(room){
        /*
        if("auto_block" in game_server[temp_game_server.room_id]){
          await create_map(temp_game_server.room_id);
        }
        */
        return game_server[room];
    }
    else{
        return game_server;
    }
};

const list_load = function(){
  return join_list;
};

init();

exports.load = load;
exports.list_load = list_load;
exports.create_map = create_map;



