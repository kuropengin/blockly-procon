
function makeTable(tableId,effect=false){
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
                cell.classList.add("wall_img");
            }
            else if(data[i][j] == 2){
                cell.classList.add("hart_img");
            }
            else if(data[i][j] == 3){
                cell.classList.add("cool_img");
                cx = j;
                cy = i;
            }
            else if(data[i][j] == 4){
                cell.classList.add("hot_img");
                hx = j;
                hy = i;
            }
            else if(data[i][j] == 34){
                cell.classList.add("ch_img");
                cx = j;
                cy = i;
                hx = j;
                hy = i;
            }
            else if(data[i][j] == 43){
                cell.classList.add("ch_img");
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
    
    var x_range = [];
    var y_range = [];
    
    if(effect){
        if(effect.t == "l"){
            if(effect.d == "top"){
                x_range = [-1,0,1];
                y_range = [-3,-2,-1];
            }else if(effect.d == "bottom"){
                x_range = [1,0,-1];
                y_range = [3,2,1];
            }else if(effect.d == "left"){
                x_range = [-3,-2,-1];
                y_range = [1,0,-1];
            }else{
                x_range = [3,2,1];
                y_range = [-1,0,1];
            }
        }
        else if(effect.t == "s"){
            if(effect.d == "top"){
              x_range = [0];
              y_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
            }else if(effect.d == "bottom"){
              x_range = [0];
              y_range = [1,2,3,4,5,6,7,8,9];
            }else if(effect.d == "left"){
              x_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
              y_range = [0];
            }else{
              x_range = [1,2,3,4,5,6,7,8,9];
              y_range = [0];
            }            
        }
        
        for(var y of y_range){
            for(var x of x_range){
                if(effect.p == "cool" && cx){
                    if(!(0 > (cx + x) || data[0].length-1 < (cx + x) || 0 > (cy + y) || data.length-1 < (cy + y))){
                        table.rows[cy+y].cells[cx+x].style.backgroundColor = "rgba(3, 169, 244, 0.3)";
                    }
                }
                else if(effect.p == "hot" && hx){
                    if(!(0 > (hx + x) || data[0].length-1 < (hx + x) || 0 > (hy + y) || data.length-1 < (hy + y))){
                        table.rows[hy+y].cells[hx+x].style.backgroundColor = "rgba(3, 169, 244, 0.3)";
                    }
                }
            }
        }
        
        if(effect.t == "r"){
            x_range = [-1,0,1];
            y_range = [-1,0,1];
        
            for(var y of y_range){
                for(var x of x_range){
                    if(effect.p == "hot" && hx){
                        if(!(0 > (hx + x) || data[0].length-1 < (hx + x) || 0 > (hy + y) || data.length-1 < (hy + y))){
                            table.rows[hy+y].cells[hx+x].style.backgroundColor = "rgba(139, 195, 74, 0.3)";
                        }
                    }
                    else if(effect.p == "cool" && cx){
                        if(!(0 > (cx + x) || data[0].length-1 < (cx + x) || 0 > (cy + y) || data.length-1 < (cy + y))){
                            table.rows[cy+y].cells[cx+x].style.backgroundColor = "rgba(139, 195, 74, 0.3)";
                        }
                    }
                }
            }
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

function cpu(level){
    makeTable("game_board",{"p":"hot","t":"r"});
    var cpu_map_date = get_map_data("hot","get_ready");
    
    
    if(level==1){
        setTimeout(function(){
            makeTable("game_board",{"p":"hot","t":"l","d":"top"});
            cpu_map_date = get_map_data("hot","look","top");
            setTimeout(function(){my_turn = true;},250);
        },250);
    }
    else{
        setTimeout(function(){
            cpu_map_date = look("top","hot");
            my_turn = true;
        },250);
    }
    
}

function next_turn(){
    if(satage_data["cpu"] ){
        cpu(satage_data["cpu"].level);
    }
    else{
        my_turn = true;
    }
}

function stage_result(status = false){
    var result_flag = false;
    
    if(satage_data["turn"]){
        satage_data["turn"] -= 1;
    }
    
    if(satage_data["mode"] == "puthot" && satage_data["map_data"][satage_data["hot_y"]][satage_data["hot_x"]] == 1){
        result_flag = true;
    }
    
    if(satage_data["mode"] == "gethart" && satage_data["get_hart_value"] <= hart_score){
        result_flag = true;
    }
    
    if(satage_data["turn"] <= 0){
        if(!result_flag){
            Code.stopJS();
        }
    }
    
    if(satage_data["block_limit"] && result_flag){
        if(Code.workspace.remainingCapacity() < 0){
            Code.stopJS();
            result_flag = false;
        }
    }
    
    if(result_flag){
        
        makeTable("game_board");
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
    
    return result_flag;
}


function get_map_data(chara, mode, direction = false){
    var x_range = [];
    var y_range = [];
    
    var now_x = satage_data[chara + "_x"];
    var now_y = satage_data[chara + "_y"];
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


function get_ready(chara="cool"){
    if(my_turn){
        makeTable("game_board",{"p":chara,"t":"r"});
        return get_map_data(chara,"get_ready");
    }
    else{
        return my_turn;
    }
}


function move_player(direction,chara="cool"){
    var move_x = 0;
    var move_y = 0;
    
    var mapdata = satage_data["map_data"];
    var x = satage_data["map_size_x"];
    var y = satage_data["map_size_y"];
    
    var px = satage_data[chara + "_x"];
    var py = satage_data[chara + "_y"];
    
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
    
    if(mapdata[py][px] == 34 || mapdata[py][px] == 43){
        mapdata[py][px] = 4;
    }
    else{
        mapdata[py][px] = 0;
    }
    
    if(0 <= px + move_x && px + move_x < x && 0 <= py + move_y && py + move_y < y){
        
        if(mapdata[py + move_y][px + move_x] == 1){
            makeTable("game_board");
            Code.stopJS();
        }
        else{
            if(mapdata[py + move_y][px + move_x] == 2){
                mapdata[py][px] = 1;
                hart_score += 1;
            }
            
            if(mapdata[py + move_y][px + move_x] == 4){
                mapdata[py + move_y][px + move_x] = 34;
            }
            else{
                mapdata[py + move_y][px + move_x] = 3;
            }
            
            satage_data[chara + "_x"] = satage_data[chara + "_x"] + move_x;
            satage_data[chara + "_y"] = satage_data[chara + "_y"] + move_y;
            
            
            if(!stage_result()){
                makeTable("game_board");
                next_turn();
                return get_map_data("cool","move");
            }
            
        }
      
    }
    else{
        makeTable("game_board");
        stage_result("gameover");
        Code.stopJS();
    }
}

function look(direction,chara="cool"){
    if(!stage_result()){
        makeTable("game_board",{"p":chara,"t":"l","d":direction});
        next_turn();
        return get_map_data(chara,"look",direction);
    }
}

function search(direction,chara="cool"){
    if(!stage_result()){
        makeTable("game_board",{"p":chara,"t":"s","d":direction});
        next_turn();
        return get_map_data(chara,"search",direction);
    }
}

function put_wall(direction,chara="cool"){
    var put_check = false;
    var around_check = false;
    
    var x = satage_data["map_size_x"];
    var y = satage_data["map_size_y"];
    
    var px = satage_data[chara + "_x"];
    var py = satage_data[chara + "_y"];
    
    if(direction === "top"){
      if(0 <= py - 1){
        py = py - 1;
        put_check = true;
      }
    }
    else if(direction === "bottom"){
      if(y > py + 1){
        py = py + 1;
        put_check = true;
      }
    }
    else if(direction === "left"){
      if(0 <= px - 1){
        px = px - 1;
        put_check = true;
      }
    }
    else{
      if(x > px + 1){
        px = px + 1;
        put_check = true;
      }
    }
    
    if(put_check){
        satage_data["map_data"][py][px] = 1;
        
        var px = satage_data[chara + "_x"];
        var py = satage_data[chara + "_y"];
        
        var c_t,c_b,c_r,c_l;
        if(0 <= py - 1){
            c_t = satage_data["map_data"][py - 1][px];
        }
        else{
            c_t = 1;
        }
        if(y > py + 1){
            c_b = satage_data["map_data"][py + 1][px];
        }
        else{
            c_b = 1;
        }
        if(0 <= px - 1){
            c_l = satage_data["map_data"][py][px - 1];
        }
        else{
            c_l = 1;
        }
        if(x > px + 1){
            c_r = satage_data["map_data"][py][px + 1];
        }
        else{
            c_r = 1;
        }
        if(c_t == 1 && c_b == 1 && c_r == 1 && c_l == 1){
            makeTable("game_board");
            Code.stopJS();
            return
        }
    }
    
    
    
    
    if(!stage_result()){
        makeTable("game_board");
        next_turn();
        return get_map_data(chara,"put");
    }
    
}


var my_map_data = [];
var hart_score = 0;
var my_turn = false;


function endCode(){
    hart_score = 0;
    satage_data = JSON.parse(JSON.stringify(reset_data));
}
