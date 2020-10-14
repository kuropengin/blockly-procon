var socket = io();
var c_name = "NoName";
var h_name = "NoName";
var load_map_size_x;
var load_map_size_y;
var temp_msg;

var query_list = {};
var query = location.search.replace( "?" , "" ).split('&');

for(parameters of query){
    var qp = parameters.split('=');
    if(qp.length == 2){
        query_list[qp[0]] = qp[1];
    }
}

if(query_list.room_id){
    var url = './../api/game?room_id=' + query_list.room_id;
    fetch(url)
    .then(function (data) {
        return data.json(); 
    })
    .then(function (json) {
        if(json){
            socket.emit('looker_join',json.room_id);
            document.getElementById('server_name').textContent = String(json.name);
        }
        else{
            document.getElementById('server_name').textContent = "存在しないサーバー";
        }
    });
    
}



socket.on("joined_room", function (msg) {
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
    temp_msg = msg;
    if(msg.effect){
        makeTable(msg,load_map_size_x,load_map_size_y, msg.effect,"game_board");
    }
    else{
        makeTable(msg,load_map_size_x,load_map_size_y, 0,"game_board");
    }
});

socket.on("new_board", function (msg) {
    temp_msg = msg;
    game_bgm_flag = true;
    if(msg.effect){
        makeTable(msg,load_map_size_x,load_map_size_y, msg.effect,"game_board");
    }
    else{
        makeTable(msg,load_map_size_x,load_map_size_y, 0,"game_board");
    }
});

socket.on("game_result", function (msg) {
    //console.log(msg);
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
    gameBgm.stop();
});

window.addEventListener( "resize", function () {
    if(temp_msg){
        if(temp_msg.effect){
            makeTable(temp_msg,load_map_size_x,load_map_size_y, temp_msg.effect,"game_board");
        }
        else{
            makeTable(temp_msg,load_map_size_x,load_map_size_y, 0,"game_board");
        }
    }
});


