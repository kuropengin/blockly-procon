//cookie
try{
    var cookie_temp = document.cookie.replace(/\s+/g, "").split(';');
    var cookie={};
    cookie_temp.forEach(function(value) {
        if(value){
            var content = value.split('=');
            cookie[content[0]] = content[1];
        }
    });
}
catch(e){
    window.alert("cookie error");
}

//init
//lng
if(cookie.lng){
    try{
        document.getElementById("lng_"+cookie.lng).checked = true;
    }
    catch(e){
        document.getElementById("lng_ja").checked = true;
    }
}
else{
    document.cookie = "lng=ja";
}

//auto_save
if(localStorage["AUTO_SAVE"]){
    try{
        document.getElementById("save_"+localStorage["AUTO_SAVE"]).checked = true;
    }
    catch(e){
        document.getElementById("save_on").checked = true;
    }
}
else{
    localStorage["AUTO_SAVE"] = "on";
}

//sound_status
if(localStorage["SOUND_STATUS"]){
    try{
        document.getElementById("sound_"+localStorage["SOUND_STATUS"]).checked = true;
    }
    catch(e){
        document.getElementById("sound_on").checked = true;
    }
}
else{
    localStorage["SOUND_STATUS"] = "on";
}

//sound_volume
if(localStorage["SOUND_VOLUME"]){
    try{
        document.getElementById('sound_volume').value = localStorage["SOUND_VOLUME"];
        document.getElementById('sound_volume_output').value = localStorage["SOUND_VOLUME"]; 
    }
    catch(e){
        localStorage["SOUND_VOLUME"]　= 50;
    }
}
else{
    localStorage["SOUND_VOLUME"]　= 50;
    document.getElementById('sound_volume_output').value = 50;
}

//bgm_init
function initBgm(){
    //game_bgm
    if(localStorage["GAME_BGM"]){
        try{
            document.getElementById('gameBgm').value = localStorage["GAME_BGM"];
        }
        catch(e){
            localStorage["GAME_BGM"] = "01.mp3";
        }
    }
    else{
        //localStorage["GAME_BGM"] = "01.mp3";
    }
    
    //result_bgm
    if(localStorage["RESULT_BGM"]){
        try{
            document.getElementById('resultBgm').value = localStorage["RESULT_BGM"];
        }
        catch(e){
            localStorage["RESULT_BGM"] = "02.mp3";
        }
    }
    else{
        //localStorage["RESULT_BGM"] = "02.mp3";
    }
    
}
    

//debug
if(localStorage["DEBUG_MODE"]){
    try{
        document.getElementById("debug_"+localStorage["DEBUG_MODE"]).checked = true;
    }
    catch(e){
        document.getElementById("debug_off").checked = true;
    }
}
else{
    localStorage["DEBUG_MODE"] = "off";
}

//lowspeed
if(localStorage["LOWSPEED_MODE"]){
    try{
        document.getElementById("lowspeed_"+localStorage["LOWSPEED_MODE"]).checked = true;
    }
    catch(e){
        document.getElementById("lowspeed_off").checked = true;
    }
}
else{
    localStorage["LOWSPEED_MODE"] = "off";
}

//loop
if(localStorage["LOOP_STATUS"]){
    try{
        document.getElementById("loop_"+localStorage["LOOP_STATUS"]).checked = true;
    }
    catch(e){
        document.getElementById("loop_on").checked = true;
    }
}
else{
    localStorage["LOOP_STATUS"] = "on";
}



 




var config_close = document.getElementById('config_close');
var config_overlay_off = function(){
    document.getElementById('config').classList.remove("overlay_on");
}
config_close.addEventListener('click', config_overlay_off, true);
config_close.addEventListener('touchend', config_overlay_off, true);


var config_close_back = document.getElementById('config');
config_close_back.addEventListener('click', config_overlay_off, false);
config_close_back.addEventListener('touchend', config_overlay_off, false);

var config_close_prevent = document.getElementById('config_area');
config_close_prevent.addEventListener('click', OnClick , false);
config_close_prevent.addEventListener('touchend', OnClick , false);

function OnClick( event ){
    var e = event || window.event;
    e.stopPropagation();
}

//system
//language
var lng_option = document.getElementsByName('lng');
var lng_change = function(){
    if(document.getElementById("lng_ja").checked){
        document.cookie = "lng=ja";
    }
    else if(document.getElementById("lng_ja-k").checked){
        document.cookie = "lng=ja-k";
    }
    else{
        document.cookie = "lng=ja";
    }
}
lng_option.forEach(function(e) {
    e.addEventListener('click', lng_change, true);
    e.addEventListener('touchend', lng_change, true);
});


//auto_save
var auto_save_option = document.getElementsByName('save');
var auto_save_change = function(){
    if(document.getElementById("save_on").checked){
        localStorage["AUTO_SAVE"] = "on";
    }
    else if(document.getElementById("save_off").checked){
        localStorage["AUTO_SAVE"] = "off";
    }
    else{
        localStorage["AUTO_SAVE"] = "on";
    }
}
auto_save_option.forEach(function(e) {
    e.addEventListener('click', auto_save_change, true);
    e.addEventListener('touchend', auto_save_change, true);
});


//reset
var option_data_reset = document.getElementById('option_data_reset');
var option_reset = function(){
    if(window.confirm('データをリセットします。よろしいですか')){
        var reset_list = ["GAME_BGM","SOUND_STATUS","DEBUG_MODE","SOUND_VOLUME","LOWSPEED_MODE","RESULT_BGM","LOOP_STATUS","AUTO_SAVE"]
        for(var reset_name of reset_list){
            localStorage.removeItem(reset_name);
        }
        document.cookie = "lng=ja";
    }
}
option_data_reset.addEventListener('click', option_reset, true);
option_data_reset.addEventListener('touchend', option_reset, true);


var tutorial_data_reset = document.getElementById('tutorial_data_reset');
var tutorial_reset = function(){
    if(window.confirm('データをリセットします。よろしいですか')){
        var url = "./../api/tutorial";
        //location.protocol + "//" + location.hostname + ":" + location.port + 
        fetch(url)
        .then(function (data) {
            return data.json(); 
        })
        .then(function (json) {
            for(var tutorial_data_name in json){
                localStorage.removeItem(tutorial_data_name);
            }
        });
    }
}
tutorial_data_reset.addEventListener('click', tutorial_reset, true);
tutorial_data_reset.addEventListener('touchend', tutorial_reset, true);


var programming_data_reset = document.getElementById('programming_data_reset');
var programming_reset = function(){
    if(window.confirm('データをリセットします。よろしいですか')){
        localStorage.removeItem("LastRun");
    }
}
programming_data_reset.addEventListener('click', programming_reset, true);
programming_data_reset.addEventListener('touchend', programming_reset, true);


//sound_status
var sound_status_option = document.getElementsByName('sound');
var sound_status_change = function(){
    if(document.getElementById("sound_on").checked){
        localStorage["SOUND_STATUS"] = "on";
    }
    else if(document.getElementById("sound_off").checked){
        localStorage["SOUND_STATUS"] = "off";
    }
    else{
        localStorage["SOUND_STATUS"] = "on";
    }
}
sound_status_option.forEach(function(e) {
    e.addEventListener('click', sound_status_change, true);
    e.addEventListener('touchend', sound_status_change, true);
});

//sound_volume
var sound_volume_option = document.getElementById('sound_volume');
var sound_volume_change = function(){
    localStorage["SOUND_VOLUME"] = sound_volume_option.value;
}
sound_volume_option.addEventListener('click', sound_volume_change, true);
sound_volume_option.addEventListener('touchend', sound_volume_change, true);

//game_bgm
var game_bgm_option = document.getElementById('gameBgm');
var game_bgm_change = function(){
    if(game_bgm_option.value == ""){
        localStorage.removeItem("GAME_BGM");
    }
    else{
        localStorage["GAME_BGM"] = game_bgm_option.value;
    }
}
game_bgm_option.addEventListener('click', game_bgm_change, true);
game_bgm_option.addEventListener('touchend', game_bgm_change, true);

//result_bgm
var result_bgm_option = document.getElementById('resultBgm');
var result_bgm_change = function(){
    if(result_bgm_option.value == ""){
        localStorage.removeItem("RESULT_BGM");
    }
    else{
        localStorage["RESULT_BGM"] = result_bgm_option.value;
    }
}
result_bgm_option.addEventListener('click', result_bgm_change, true);
result_bgm_option.addEventListener('touchend', result_bgm_change, true);



//debug
var debug_option = document.getElementsByName('debug');
var debug_change = function(){
    if(document.getElementById("debug_on").checked){
        localStorage["DEBUG_MODE"] = "on";
    }
    else if(document.getElementById("debug_off").checked){
        localStorage["DEBUG_MODE"] = "off";
    }
    else{
        localStorage["DEBUG_MODE"] = "off";
    }
}
debug_option.forEach(function(e) {
    e.addEventListener('click', debug_change, true);
    e.addEventListener('touchend', debug_change, true);
});

//lowspeed
var lowspeed_option = document.getElementsByName('lowspeed');
var lowspeed_change = function(){
    if(document.getElementById("lowspeed_on").checked){
        localStorage["LOWSPEED_MODE"] = "on";
    }
    else if(document.getElementById("lowspeed_off").checked){
        localStorage["LOWSPEED_MODE"] = "off";
    }
    else{
        localStorage["LOWSPEED_MODE"] = "off";
    }
}
lowspeed_option.forEach(function(e) {
    e.addEventListener('click', lowspeed_change, true);
    e.addEventListener('touchend', lowspeed_change, true);
});

//loop
var loop_option = document.getElementsByName('loop');
var loop_change = function(){
    if(document.getElementById("loop_on").checked){
        localStorage["LOOP_STATUS"] = "on";
    }
    else if(document.getElementById("loop_off").checked){
        localStorage["LOOP_STATUS"] = "off";
    }
    else{
        localStorage["LOOP_STATUS"] = "on";
    }
}
loop_option.forEach(function(e) {
    e.addEventListener('click', loop_change, true);
    e.addEventListener('touchend', loop_change, true);
});


//load_init
window.addEventListener('load', function() {
    var config_button = document.getElementById('configButton');
    var config_overlay_on = function(){
        document.getElementById('config').classList.add("overlay_on");
    }
    config_button.addEventListener('click', config_overlay_on, true);
    config_button.addEventListener('touchend', config_overlay_on, true);
    
    getBgmList();   
})



function getBgmList() {
    var url = '/api/bgm';
    fetch(url)
    .then(function (data) {
        return data.json(); 
    })
    .then(function (json) {
        if(json){
            for(let bgm of json){
                addOption("gameBgm",bgm);
                addOption("resultBgm",bgm);
            }
            initBgm();
        }
    });
}

function addOption(id,bgm) {
    var select = document.getElementById(id);
    var option = document.createElement("option");
    option.text = bgm;
    option.value = bgm;
    select.appendChild(option);
}

function loadAbout(){
    var url = '/about/LICENSE';
    fetch(url)
    .then(function (data) {
        return data.text(); 
    })
    .then(function (text) {
        document.getElementById('license').value = text;
    });
}
loadAbout();