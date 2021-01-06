
var socket = io();
var servar_connect_status = false;
var timeId = null;
var my_turn = false;
var look_search_data = false;
var variable_record = {};



var roop_run;
var next_my_trun = false;


socket.on("get_ready_rec", function (msg) {
    //console.log(msg.rec_data);
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
});

socket.on("error", function (msg) {
    Code.stopJS();
});



