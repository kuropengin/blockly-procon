
function makeTable(tableId){
    var data = satage_data["map_data"];
    var y = satage_data["map_size_y"];
    
    var c = document.getElementById("ready_player");
    if(c){
        c.parentNode.removeChild(c);
    }
    c = document.getElementById("game_result");
    if(c){
        c.parentNode.removeChild(c);
    }
    
    var rows=[];
    var table = document.createElement("table");
    table.setAttribute("id","game_board_table");
    
    c = document.getElementById("game_board_table");
    if(c){
        c.parentNode.removeChild(c);
    }
    
    var _y = (450 - (4*y) )/ y;
    _y =  _y.toString();
    
    var cx = false,cy = false,hx = false,hy = false;

    for(i = 0; i < data.length; i++){
        rows.push(table.insertRow(-1));
        for(j = 0; j < data[0].length; j++){
            cell=rows[i].insertCell(-1);
            
            if(data[i][j] == 1){
                cell.style.backgroundImage = "url(/images/wall.png)";
            }
            else if(data[i][j] == 2){
                cell.style.backgroundImage = "url(/images/hart.png)";
            }
            else if(data[i][j] == 3){
                cell.style.backgroundImage = "url(/images/cool.png)";
                cx = j;
                cy = i;
            }
            else if(data[i][j] == 4){
                cell.style.backgroundImage = "url(/images/hot.png)";
                hx = j;
                hy = i;
            }
            else if(data[i][j] == 34){
                cell.style.backgroundImage = "url(/images/ch.png)";
                cx = j;
                cy = i;
                hx = j;
                hy = i;
            }
            else if(data[i][j] == 43){
                cell.style.backgroundImage = "url(/images/hc.png)";
                cx = j;
                cy = i;
                hx = j;
                hy = i;
            }
            
            //cell.appendChild(document.createTextNode(data[i][j]));

            cell.style.height = _y + "px";
            cell.style.width = _y + "px";
            
        }
    }

    document.getElementById(tableId).appendChild(table);
    
    document.getElementById('turn_now').textContent = String(satage_data["turn"]);
}

var Sound_Volume = 0.5;
if(localStorage["SOUND_VOLUME"]){
    Sound_Volume = localStorage["SOUND_VOLUME"] / 100;
}

var resultSound = new Howl({
    src: ['sound/tutorial_result.mp3'],
    volume: Sound_Volume
});

function stage_result(status = false){
    var result_flag = false;
    
    satage_data["turn"] -= 1;
    makeTable("game_board");
    
    
    if(satage_data["mode"] == "gethart" && satage_data["get_hart_value"] <= hart_score){
        result_flag = true;
    }
    
    if(result_flag){
        Code.stopJS();
        
        if(localStorage["SOUND_STATUS"]){
            if(localStorage["SOUND_STATUS"] == "on"){
                resultSound.play();
            }
        }
        else{
            resultSound.play();
        }
        
        var result = document.createElement("div"); 
        result.setAttribute("id","game_result");
        var img = document.createElement('img');
        img.src = '/images/stageclear.png';
        result.appendChild(img);
        document.getElementById("game_board").appendChild(result);
        
        var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        
        if(localStorage["AUTO_SAVE"]){
            if(localStorage["AUTO_SAVE"] == "on"){
                localStorage.setItem(satage_data["stage_id"], xmlText); 
            }
        }
        
        document.getElementById('overlay').classList.add("overlay_on");
        
        
        var cancel_button = document.getElementById('cancel');
        var overlay_off = function(){
            document.getElementById('overlay').classList.remove("overlay_on");
        }
        cancel_button.addEventListener('click', overlay_off, true);
        cancel_button.addEventListener('touchend', overlay_off, true);
        
    }
    
    my_turn = true;
    return result_flag;
}


function get_map_data(mode, direction = false){
    var x_range = [];
    var y_range = [];
    
    var now_x = satage_data["cool_x"];
    var now_y = satage_data["cool_y"];
    var load_map_size_x = satage_data["map_size_x"];
    var load_map_size_y = satage_data["map_size_y"];
    
    var chara = "cool";
    var chara_num_diff = {"cool":4,"hot":3};
    
    if(mode == "search"){
        if(direction == "top"){
          x_range = [0];
          y_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
        }else if(direction == "bottom"){
          x_range = [0];
          y_range = [1,2,3,4,5,6,7,8,9];
        }else if(direction == "left"){
          x_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
          y_range = [0];
        }else{
          x_range = [1,2,3,4,5,6,7,8,9];
          y_range = [0];
        }
    }
    else if(mode == "look"){
        if(direction == "top"){
          x_range = [-1,0,1];
          y_range = [-3,-2,-1];
        }else if(direction == "bottom"){
          x_range = [-1,0,1];
          y_range = [1,2,3];
        }else if(direction == "left"){
          x_range = [-3,-2,-1];
          y_range = [-1,0,1];
        }else{
          x_range = [1,2,3];
          y_range = [-1,0,1];
        }
    }
    else{
        x_range = [-1,0,1];
        y_range = [-1,0,1];
    }
    
    var tmp_map_data = satage_data["map_data"];
    var return_map_data = [];
    
    for(var y of y_range){
      for(var x of x_range){
        if(0 > (now_x + x) || (load_map_size_x - 1) < (now_x + x) || 0 > (now_y + y) || (load_map_size_y - 1) < (now_y + y)){
          return_map_data.push(2);
        }
        else{
          if(tmp_map_data[now_y + y][now_x + x] == chara_num_diff[chara] || tmp_map_data[now_y + y][now_x + x] == 34){
            return_map_data.push(1);
          }
          else{
            if(tmp_map_data[now_y + y][now_x + x] == 2){
              return_map_data.push(3);
            }
            else if(tmp_map_data[now_y + y][now_x + x] == 1){
              return_map_data.push(2);
            }
            else{
              return_map_data.push(0);
            } 
          } 
        }
      }
    }
    
    return return_map_data;
    
}


function get_ready(){
    if(my_turn){
        return get_map_data("get_ready");
    }
    else{
        return my_turn;
    }
}


function move_player(direction){
    var move_x = 0;
    var move_y = 0;
    
    var mapdata = satage_data["map_data"];
    var x = satage_data["map_size_x"];
    var y = satage_data["map_size_y"];
    
    var px = satage_data["cool_x"];
    var py = satage_data["cool_y"];
    
    if(direction == "top"){
        move_y = -1;
    }
    else if(direction == "bottom"){
        move_y = 1;
    }
    else if(direction == "left"){
        move_x = -1;
    }
    else if(direction == "right"){
        move_x = 1;
    }
    
    if(0 <= px + move_x && px + move_x < x && 0 <= py + move_y && py + move_y < y){
        mapdata[py][px] = 0;
        if(mapdata[py + move_y][px + move_x] == 1){
            makeTable("game_board");
            Code.stopJS();
        }
        else{
            if(mapdata[py + move_y][px + move_x] == 2){
                mapdata[py][px] = 1;
                hart_score += 1;
            }
            
            mapdata[py + move_y][px + move_x] = 3;
            
            satage_data["cool_x"] = satage_data["cool_x"] + move_x;
            satage_data["cool_y"] = satage_data["cool_y"] + move_y;
            
            
            if(!stage_result()){
                return get_map_data("move");
            }
            
        }
      
    }
    else{
        stage_result("gameover");
        Code.stopJS();
    }
}

function look(direction){
    if(!stage_result()){
        return get_map_data("look",direction);
    }
}

function search(direction){
    if(!stage_result()){
        return get_map_data("search",direction);
    }
}

function put_wall(direction){
    var put_check = false;
    var put_x = 0;
    var put_y = 0;
    
    var x = satage_data["map_size_x"];
    var y = satage_data["map_size_y"];
    
    var px = satage_data["cool_x"];
    var py = satage_data["cool_y"];
    
    if(direction === "top"){
      if(0 <= py - 1){
        put_y = py - 1;
        put_check = true;
      }
    }
    else if(direction === "bottom"){
      if(y > py + 1){
        put_y = py + 1;
        put_check = true;
      }
    }
    else if(direction === "left"){
      if(0 <= px - 1){
        put_x = px - 1;
        put_check = true;
      }
    }
    else{
      if(x > px + 1){
        put_x = px + 1;
        put_check = true;
      }
    }
    
    if(put_check){
      server_store[room].map_data[put_y][put_x] = 1;
    }
    
    if(!stage_result()){
        return get_map_data("put");
    }
    
}


var my_map_data = [];
var hart_score = 0;
var my_turn = false;


function endCode(){
    hart_score = 0;
    satage_data = JSON.parse(JSON.stringify(reset_data));
}
