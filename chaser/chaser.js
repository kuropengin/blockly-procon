//server.jsを機能ごとに分割中

//socket.io
const socket_io = require('socket.io'); 
const io = socket_io();

const server_data = require('../tool/chaser_data_load');

//var init
var store = {};
var looker = {};
var match_room_store = {};

//deep copy
var server_store = JSON.parse(JSON.stringify(server_data.load()));

//socket.io on
io.on('connection',function(socket){
  
    socket.on('player_join', function(msg){
      
      if(server_store[msg.room_id] && (!server_store[msg.room_id].cool.status || !server_store[msg.room_id].hot.status) && !server_store[msg.room_id].match){
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
            server_store[msg.room_id].cool.name = "接続待機中";
          }
          if(!server_store[msg.room_id].hot.status){
            server_store[msg.room_id].hot.name = "接続待機中";
          }
  
          if(!server_store[msg.room_id].cool.status){
            server_store[msg.room_id].cool.status = true;
            server_store[msg.room_id].cool.turn = false;
            server_store[msg.room_id].cool.getready = true;
            server_store[msg.room_id].cool.score = 0;
            server_store[msg.room_id].cool.name = msg.name;
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
      
      }
      else if(!server_store[msg.room_id]){
        io.to(socket.id).emit("error", "サーバーIDが存在しません");
      }
      else if(server_store[msg.room_id].match){
        var join_flag = false;
        if(server_store[msg.room_id].release){
          if(!server_store[msg.room_id].cool.status){
            server_store[msg.room_id].cool.name = "接続待機中";
          }
          if(!server_store[msg.room_id].hot.status){
            server_store[msg.room_id].hot.name = "接続待機中";
          }
          if(server_store[msg.room_id].release.cool && !server_store[msg.room_id].cool.status){
            server_store[msg.room_id].cool.status = true;
            server_store[msg.room_id].cool.turn = false;
            server_store[msg.room_id].cool.getready = true;
            server_store[msg.room_id].cool.score = 0;
            server_store[msg.room_id].cool.name = msg.name;
            room_chara = "cool";
            join_flag = true;
          }
          else if(server_store[msg.room_id].release.hot && !server_store[msg.room_id].hot.status){
            server_store[msg.room_id].hot.status = true;
            server_store[msg.room_id].hot.turn = false;
            server_store[msg.room_id].hot.getready = true;
            server_store[msg.room_id].hot.score = 0;
            server_store[msg.room_id].hot.name = msg.name;
            room_chara = "hot";
            join_flag = true;
          }
        }
        else{
          io.to(socket.id).emit("error", "接続先サーバーは使用中です");
        }
        
        if(join_flag){
          
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
        }
      }
      else{
        io.to(socket.id).emit("error", "接続先サーバーは満室です");
      }
    });
  
    socket.on('match_init', function(msg){
      if(server_store[msg.room_id]){
        if(!server_store[msg.room_id].cool.status && !server_store[msg.room_id].hot.status && !server_store[msg.room_id].match){
          match_room_store[socket.id] = msg.room_id;
          server_store[msg.room_id].match = true;
          io.to(socket.id).emit("match_init_rec", {"key":socket.id});
  
          if(server_store[msg.room_id].cpu){
            server_store[msg.room_id][server_store[msg.room_id].cpu.turn].status = true;
            server_store[msg.room_id][server_store[msg.room_id].cpu.turn].turn = false;
            server_store[msg.room_id][server_store[msg.room_id].cpu.turn].getready = true;
            server_store[msg.room_id][server_store[msg.room_id].cpu.turn].score = 0;
            server_store[msg.room_id][server_store[msg.room_id].cpu.turn].name = "cpu";
          }
        }
        else{
          io.to(socket.id).emit("match_init_rec", {"error":"接続先サーバーは使用中です"});
        }
      }
      else{
        io.to(socket.id).emit("error", "サーバーIDが存在しません");
      }
    });
  
    socket.on('match_start_check', function(){
      if(match_room_store[socket.id]){
        if(server_store[match_room_store[socket.id]].cool.status && server_store[match_room_store[socket.id]].hot.status){
          io.to(socket.id).emit("match_start_check_rec", true);
        }
        else{
          io.to(socket.id).emit("match_start_check_rec", false);
        }
      }
      else{
        io.to(socket.id).emit("error", "不正な操作です");
      }
    });
  
    socket.on('match_start', function(){
      if(match_room_store[socket.id]){
        if(server_store[match_room_store[socket.id]].cool.status && server_store[match_room_store[socket.id]].hot.status){
          server_store[match_room_store[socket.id]].match = false; 
  
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
          setTimeout(game_start_timer, 500, match_room_store[socket.id]);
        }
      }
      else{
        io.to(socket.id).emit("error", "不正な操作です");
      }
    });
  
    socket.on('player_join_match', function(msg){
      if(!server_store[msg.room_id].cool.status){
        server_store[msg.room_id].cool.name = "接続待機中";
      }
      if(!server_store[msg.room_id].hot.status){
        server_store[msg.room_id].hot.name = "接続待機中";
      }
  
      var join_flag = false;
  
      if(msg.chara == "cool" && !server_store[msg.room_id].cool.status){
        server_store[msg.room_id].cool.status = true;
        server_store[msg.room_id].cool.turn = false;
        server_store[msg.room_id].cool.getready = true;
        server_store[msg.room_id].cool.score = 0;
        server_store[msg.room_id].cool.name = msg.name;
        room_chara = "cool";
        join_flag = true;
      }
      else if(msg.chara == "hot" && !server_store[msg.room_id].hot.status){
        server_store[msg.room_id].hot.status = true;
        server_store[msg.room_id].hot.turn = false;
        server_store[msg.room_id].hot.getready = true;
        server_store[msg.room_id].hot.score = 0;
        server_store[msg.room_id].hot.name = msg.name;
        room_chara = "hot";
        join_flag = true;
      }
  
      if(join_flag){
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
      }
      else{
        io.to(socket.id).emit("error", "接続先サーバーは使用中です");
      }
    });
  
    socket.on('release', function(msg){
      try{
        if(msg.room_id == match_room_store[msg.key]){
          if(!server_store[msg.room_id].release){
            server_store[msg.room_id].release = {};
          }
          
          if(msg.chara == "cool"){
            server_store[msg.room_id].release.cool = true;
          }
          else if(msg.chara == "hot"){
            server_store[msg.room_id].release.hot = true;
          }
        }
      }
      catch(e){
        console.log(e);
      }
  
    });
    
    socket.on('move_player', function(msg){
      if(store[socket.id]){
        move_player(store[socket.id].room,store[socket.id].chara,msg,socket.id);
      }
    });
    
    socket.on('get_ready', function(){
      if(store[socket.id]){
        get_ready(store[socket.id].room,store[socket.id].chara,socket.id)
      }
    });
    
    socket.on('look', function(msg){
      if(store[socket.id]){
        look(store[socket.id].room,store[socket.id].chara,msg,socket.id);
      }
    });
    
    socket.on('search', function(msg){
      if(store[socket.id]){
        search(store[socket.id].room,store[socket.id].chara,msg,socket.id);
      }
    });
    
    socket.on('put_wall', function(msg){
      if(store[socket.id]){
        put_wall(store[socket.id].room,store[socket.id].chara,msg,socket.id);
      }
    });
    
    socket.on('looker_join', function(msg){
      if(server_store[msg]){
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
      }
      
    });
  
    socket.on('disconnect', function(){
      if (store[socket.id]) {
        console.log("o:"+store[socket.id]);
        if(server_store[store[socket.id].room].cool.status && server_store[store[socket.id].room].hot.status && !server_store[store[socket.id].room].match){
          if(store[socket.id].chara == "cool"){
            game_result_check(store[socket.id].room, store[socket.id].chara , "r", false, "hot","切断より");
          }
          else{
            game_result_check(store[socket.id].room, store[socket.id].chara , "r", false, "cool","切断より");
          }
        }
        else if(server_store[store[socket.id].room].match){
          server_store[store[socket.id].room][store[socket.id].chara].status = false;
          delete store[socket.id];
        }
        else{
          game_server_reset(store[socket.id].room);
        }
      }
      else if(looker[socket.id]){
        socket.leave(looker[socket.id].room);
        delete looker[socket.id];
      }
      if(match_room_store[socket.id]){
        io.in(match_room_store[socket.id]).emit("error", "サーバー側から切断されました");
        if(server_store[match_room_store[socket.id]].cool.status && server_store[match_room_store[socket.id]].hot.status){
          game_server_reset(match_room_store[socket.id]);
        }
        for(var s_user in match_room_store){
          if(s_user != socket.id && match_room_store[s_user] == match_room_store[socket.id]){
            delete match_room_store[socket.id];
            break;
          }
        }
        if(match_room_store[socket.id]){
          server_store[match_room_store[socket.id]].match = false;
          delete match_room_store[socket.id];
        }
      }
    });
    
    socket.on('leave_room', function(){
      if (store[socket.id]) {
        if(server_store[store[socket.id].room].cool.status && server_store[store[socket.id].room].hot.status && !server_store[store[socket.id].room].match){
          if(store[socket.id].chara == "cool"){
            game_result_check(store[socket.id].room, store[socket.id].chara , "r", false, "hot","切断より");
          }
          else{
            game_result_check(store[socket.id].room, store[socket.id].chara , "r", false, "cool","切断より");
          }
        }
        else if(server_store[store[socket.id].room].match){
          server_store[store[socket.id].room][store[socket.id].chara].status = false;
          delete store[socket.id];
        }
        else{
          game_server_reset(store[socket.id].room);
        }
      }
      else if(looker[socket.id]){
        socket.leave(looker[socket.id].room);
        delete looker[socket.id];
      }
      if(match_room_store[socket.id]){
        io.in(match_room_store[socket.id]).emit("error", "サーバー側から切断されました");
        if(server_store[match_room_store[socket.id]].cool.status && server_store[match_room_store[socket.id]].hot.status){
          game_server_reset(match_room_store[socket.id]);
        }
        for(var s_user in match_room_store){
          if(s_user != socket.id && match_room_store[s_user] == match_room_store[socket.id]){
            delete match_room_store[socket.id];
            break;
          }
        }
        if(match_room_store[socket.id]){
          server_store[match_room_store[socket.id]].match = false;
          delete match_room_store[socket.id];
        }
        
      }
    });
  
    socket.on('match_end', function(){
      if(match_room_store[socket.id]){
        delete match_room_store[socket.id];
      }
      if(looker[socket.id]){
        socket.leave(looker[socket.id].room);
        delete looker[socket.id];
      }
    });
  
});

exports.io = io;