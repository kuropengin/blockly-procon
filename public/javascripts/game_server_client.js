function ready_game(elementId){
    var c = document.getElementById("game_board_table");
    if(c){
        c.parentNode.removeChild(c);
    }
    c = document.getElementById("game_info_div");
    if(c){
        c.parentNode.removeChild(c);
    }
    c = document.getElementById("game_result");
    if(c){
        c.parentNode.removeChild(c);
    }
    
    var ready_player = document.createElement("div");
    ready_player.setAttribute("id","ready_player");
    
    c = document.getElementById("ready_player");
    if(c){
        c.parentNode.removeChild(c);
    }
    
    var ready_server = document.createElement("div"); 
    ready_server.setAttribute("id","ready_server");
    var newContent = document.createTextNode("マッチング中"); 
    ready_server.appendChild(newContent);
    ready_player.appendChild(ready_server);  
    
    if(c_name.length){
        var ready_cool = document.createElement("div"); 
        ready_cool.setAttribute("id","ready_cool");
        var newContent = document.createTextNode(c_name); 
        ready_cool.appendChild(newContent);
        ready_player.appendChild(ready_cool);        
    }
    
    if(h_name.length){
        var ready_hot = document.createElement("div"); 
        ready_hot.setAttribute("id","ready_hot");
        var newContent = document.createTextNode(h_name); 
        ready_hot.appendChild(newContent);
        ready_player.appendChild(ready_hot);        
    }
    else{
        var ready_hot = document.createElement("div"); 
        ready_hot.setAttribute("id","wait_hot");
        var newContent = document.createTextNode("接続待ち"); 
        ready_hot.appendChild(newContent);
        ready_player.appendChild(ready_hot); 
    }
    
    document.getElementById(elementId).appendChild(ready_player);
    
}

function makeTable(msg, y, effect, tableId){
    var data = msg.map_data;
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
    
    var x_range = [];
    var y_range = [];
    
    if(msg.effect){
        if(msg.effect.t == "l"){
            if(msg.effect.d == "top"){
                x_range = [-1,0,1];
                y_range = [-3,-2,-1];
            }else if(msg.effect.d == "bottom"){
                x_range = [1,0,-1];
                y_range = [3,2,1];
            }else if(msg.effect.d == "left"){
                x_range = [-3,-2,-1];
                y_range = [1,0,-1];
            }else{
                x_range = [3,2,1];
                y_range = [-1,0,1];
            }
        }
        else if(msg.effect.t == "s"){
            if(msg.effect.d == "top"){
              x_range = [0];
              y_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
            }else if(msg.effect.d == "bottom"){
              x_range = [0];
              y_range = [1,2,3,4,5,6,7,8,9];
            }else if(msg.effect.d == "left"){
              x_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
              y_range = [0];
            }else{
              x_range = [1,2,3,4,5,6,7,8,9];
              y_range = [0];
            }            
        }
        
        for(var y of y_range){
            for(var x of x_range){
                if(msg.effect.p == "cool" && cx){
                    if(!(0 > (cx + x) || data[0].length-1 < (cx + x) || 0 > (cy + y) || data.length-1 < (cy + y))){
                        table.rows[cy+y].cells[cx+x].style.backgroundColor = "rgba(3, 169, 244, 0.3)";
                    }
                }
                else if(msg.effect.p == "hot" && hx){
                    if(!(0 > (hx + x) || data[0].length-1 < (hx + x) || 0 > (hy + y) || data.length-1 < (hy + y))){
                        table.rows[hy+y].cells[hx+x].style.backgroundColor = "rgba(3, 169, 244, 0.3)";
                    }
                }
            }
        }
        
        x_range = [-1,0,1];
        y_range = [-1,0,1];
        
        for(var y of y_range){
            for(var x of x_range){
                if(msg.effect.p == "cool" && hx){
                    if(!(0 > (hx + x) || data[0].length-1 < (hx + x) || 0 > (hy + y) || data.length-1 < (hy + y))){
                        table.rows[hy+y].cells[hx+x].style.backgroundColor = "rgba(139, 195, 74, 0.3)";
                    }
                }
                else if(msg.effect.p == "hot" && cx){
                    if(!(0 > (cx + x) || data[0].length-1 < (cx + x) || 0 > (cy + y) || data.length-1 < (cy + y))){
                        table.rows[cy+y].cells[cx+x].style.backgroundColor = "rgba(139, 195, 74, 0.3)";
                    }
                }
            }
        }
    }
    
    var odiv = document.createElement("div");
    odiv.setAttribute("id","game_info_div");
    
    c = document.getElementById("game_info_div");
    if(c){
        c.parentNode.removeChild(c);
    }
    

    var cdiv = document.createElement("div"); 
    cdiv.setAttribute("id","cool_info_div");
    
    var cndiv = document.createElement("div"); 
    cndiv.setAttribute("id","cool_name");
    var newContent = document.createTextNode(c_name); 
    cndiv.appendChild(newContent);
    
    var csdiv = document.createElement("div"); 
    csdiv.setAttribute("id","cool_score");
    newContent = document.createTextNode(msg.cool_score); 
    csdiv.appendChild(newContent);
    
    cdiv.appendChild(cndiv);
    cdiv.appendChild(csdiv);
    
    
    var turndiv = document.createElement("div");
    turndiv.setAttribute("id","turn_div");
    
    var tturn = document.createElement("div");
    tturn.setAttribute("id","turn_title");
    newContent = document.createTextNode("残りターン数"); 
    tturn.appendChild(newContent);
    
    var nturn = document.createElement("div");
    nturn.setAttribute("id","turn_n");
    newContent = document.createTextNode(msg.turn);
    nturn.appendChild(newContent);
    
    turndiv.appendChild(tturn);
    turndiv.appendChild(nturn);
    
    
    var hdiv = document.createElement("div"); 
    hdiv.setAttribute("id","hot_info_div");
    
    var hndiv = document.createElement("div"); 
    hndiv.setAttribute("id","hot_name");
    var newContent = document.createTextNode(h_name); 
    hndiv.appendChild(newContent);
    
    var hsdiv = document.createElement("div"); 
    hsdiv.setAttribute("id","hot_score");
    newContent = document.createTextNode(msg.hot_score); 
    hsdiv.appendChild(newContent);
    
    hdiv.appendChild(hndiv);
    hdiv.appendChild(hsdiv);
    
    
    odiv.appendChild(cdiv);
    odiv.appendChild(turndiv);
    odiv.appendChild(hdiv);
    
    
    document.getElementById(tableId).appendChild(table);
    document.getElementById("game_info").appendChild(odiv);
}

var Sound_Volume = 0.5;
if(localStorage["SOUND_VOLUME"]){
    Sound_Volume = localStorage["SOUND_VOLUME"] / 100;
}

var gameBgmFile = "sound/01.mp3";
var resultSoundFile = "sound/02.mp3";
if(localStorage["GAME_BGM"]){
    gameBgmFile = "bgm/" + localStorage["GAME_BGM"];
}
if(localStorage["RESULT_BGM"]){
    resultSoundFile = "bgm/" + localStorage["RESULT_BGM"];
}


var gameBgm = new Howl({
    src: [gameBgmFile],
    loop: true,
    volume: Sound_Volume
});
var resultSound = new Howl({
    src: [resultSoundFile],
    volume: Sound_Volume
});




var socket = io();
var servar_connect_status = false;
var timeId = null;
var my_turn = false;
var look_search_data = false;
var variable_record = {};


var load_map_size_x;
var load_map_size_y;
var now_x = null;
var now_y = null;
var c_name = "NoName";
var h_name = "NoName";

var roop_run;
var next_my_trun = false;


socket.on("joined_room", function (msg) {
    servar_connect_status = true;
    load_map_size_x = msg.x_size;
    load_map_size_y = msg.y_size;
    if(msg.cool_name){
        c_name = msg.cool_name;
    }
    if(msg.hot_name){
        h_name = msg.hot_name; 
    }
    if(msg.cpu_name){
        h_name = msg.cpu_name;     
    }
    ready_game("game_board");
});


socket.on("updata_board", function (msg) {
    if(msg.effect){
        makeTable(msg,load_map_size_y, msg.effect,"game_board");
    }
    else{
        makeTable(msg,load_map_size_y, 0,"game_board");
    }
});

socket.on("new_board", function (msg) {
    if(localStorage["SOUND_STATUS"]){
        if(localStorage["SOUND_STATUS"] == "on"){
            gameBgm.play();
        }
    }
    else{
        gameBgm.play();
    }
    
    if(msg.effect){
        makeTable(msg,load_map_size_y, msg.effect,"game_board");
    }
    else{
        makeTable(msg,load_map_size_y, 0,"game_board");
    }
});

socket.on("get_ready_rec", function (msg) {
    console.log(msg.rec_data);
    if(!my_turn){
        my_turn = msg.rec_data;
    }
});

socket.on("move_rec", function (msg) {
    if(my_turn){
        my_turn = false;
        look_search_data = msg.rec_data;
    }
});

socket.on("put_rec", function (msg) {
    if(my_turn){
        my_turn = false;
        look_search_data = msg.rec_data;
    }
});

socket.on("look_rec", function (msg) {
    if(my_turn){
        my_turn = false;
        look_search_data = msg.rec_data;
    }
});

socket.on("search_rec", function (msg) {
    if(my_turn){
        my_turn = false;
        look_search_data = msg.rec_data;
    }
});

socket.on("game_result", function (msg) {
    Code.stopJS();
    
    if(localStorage["SOUND_STATUS"]){
        if(localStorage["SOUND_STATUS"] == "on"){
            gameBgm.stop();
            resultSound.play();
        }
    }
    else{
        gameBgm.stop();
        resultSound.play();
    }
    
    var result = document.createElement("div"); 
    result.setAttribute("id","game_result");
    var img = document.createElement('img');
    if(msg.winer == "cool"){
        img.src = '/images/coolwin.png';
    }
    else if(msg.winer == "hot"){
        img.src = '/images/hotwin.png';
    }
    else{
        img.src = '/images/draw.png';
    }
    result.appendChild(img);
    document.getElementById("game_board").appendChild(result);
});

socket.on("error", function (msg) {
    Code.stopJS();
    window.alert(msg);
});



