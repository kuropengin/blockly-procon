function makeTable(data, y, effect, tableId){
    var rows=[];
    var table = document.createElement("table");
    table.setAttribute("id","game_board_table");
    
    var c = document.getElementById("game_board_table");
    if(c){
        c.parentNode.removeChild(c);
    }
    
    var _y = (450 - (4*y) )/ y;
    _y =  _y.toString();

    for(i = 0; i < data.length; i++){
        rows.push(table.insertRow(-1));
        for(j = 0; j < data[0].length; j++){
            cell=rows[i].insertCell(-1);
            
            if(data[i][j] == 1){
                var wall = document.createElement('img');
                wall.src = "/images/wall.png"; 
                cell.appendChild(wall);
            }
            else if(data[i][j] == 2){
                var hart = document.createElement('img'); 
                hart.src = "/images/hart.png"; 
                cell.appendChild(hart);
            }
            else if(data[i][j] == 3){
                var cool = document.createElement('img'); 
                cool.src = "/images/cool.png";
                cell.appendChild(cool);
            }
            else if(data[i][j] == 4){
                var hot = document.createElement('img');
                hot.src = "/images/hot.png"; 
                cell.appendChild(hot);
            }
            
            //cell.appendChild(document.createTextNode(data[i][j]));

            cell.style.height = _y + "px";
            cell.style.width = _y + "px";
            



        }
    }
    document.getElementById(tableId).appendChild(table);
}


var socket = io();
var servar_connect_status = false;
var timeId = null;
var my_turn = false;
var tmp_map_data = [];
var my_map_data = [];
var variable_record = {};


var load_map_size_x = null;
var load_map_size_y = null;
var now_x = null;
var now_y = null;


socket.on("connected", function() {});
socket.on("disconnect", function () {});

socket.on("join_room", function (msg) {
    load_map_size_x = msg.x_size;
    load_map_size_y = msg.y_size;
});

socket.on("updata_board", function (msg) {
    //console.log(msg);
    if(msg.effect){
        makeTable(msg.map_data,load_map_size_y, msg.effect,"game_board");
    }
    else{
        makeTable(msg.map_data,load_map_size_y, 0,"game_board");
    }
});

socket.on("you_turn", function (msg) {
    my_map_data = [];
    tmp_map_data = Array.from(msg.map_data);
    now_x = msg.x;
    now_y = msg.y;
    for(var y of [-1,0,1]){
        if(0 > (now_y + y) || (load_map_size_y - 1) < (now_y + y)){
            for(var x of [-1,0,1]){
                my_map_data.push(1);
            }
        }
        else{
            for(var x of [-1,0,1]){
                if(0 > (now_x + x) || (load_map_size_x - 1) < (now_x + x)){
                    my_map_data.push(1);
                }
                else{
                   my_map_data.push(msg.map_data[now_y + y][now_x + x]); 
                }
            }
        }
    }
    my_turn = true;
});

socket.on("error", function (msg) {
    Code.stopJS();
    window.alert(msg);
});

function join(id,name){
    var user = {};
    user.room_id = id;
    user.name = name;
    socket.emit("player_join", user);
}

function move_player(direction){
    if(my_turn){
        socket.emit("move_player", direction);
        my_turn = false;
    }
}

function look(dropdown_look){
    if(my_turn){
        socket.emit("look",{"effect":dropdown_look});
        my_turn = false;
    }
}

function search(dropdown_search){
    if(my_turn){
        socket.emit("search",{"effect":dropdown_search});
        my_turn = false;
    }
}


function turn_ready(){
    return my_turn;
}

function servar_status(){
    return servar_connect_status;
}








