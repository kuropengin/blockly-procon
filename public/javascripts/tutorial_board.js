
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
}

function stage_result(){
    var result_flag = false;
    
    if(satage_data["mode"] == "gethart" && satage_data["get_hart_value"] <= hart_score){
        result_flag = true;
    }
    
    if(result_flag){
        Code.stopJS();
        var result = document.createElement("div"); 
        result.setAttribute("id","game_result");
        var img = document.createElement('img');
        img.src = '/images/stageclear.png';
        result.appendChild(img);
        document.getElementById("game_board").appendChild(result);
        
        var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        
        localStorage.setItem(satage_data["stage_id"], xmlText); 
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
            
            makeTable("game_board");
            stage_result();
        }
      
    }
    else{
        makeTable("game_board");
        Code.stopJS();
    }
    
}

var servar_connect_status = false;
var my_map_data = [];
var hart_score = 0;

function servar_status(){
    return servar_connect_status;
}

function endCode(){
    hart_score = 0;
    satage_data = JSON.parse(JSON.stringify(reset_data));
}
