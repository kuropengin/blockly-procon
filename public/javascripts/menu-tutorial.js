
function createStageList(get_list){

  var satage_list = [];
  
  for(satage in get_list){
    satage_list.push(satage);
  }
  
  var h = document.getElementById('satage_list').clientHeight;
  var div_num = Math.ceil(h/80);
  
  
  if(satage_list.length >= div_num){
    div_num = satage_list.length*2;
  }
  else{
    div_num = Math.ceil(h*2/80);
  }
  
  for(var i=0; i < div_num; i++){
    var one_satage = document.createElement('div');
    one_satage.classList.add("one_satage");
    
    var level = false;
    if(get_list[satage_list[i%satage_list.length]].level){
      level = get_list[satage_list[i%satage_list.length]].level;
    }
    
    
    var satage_div = document.createElement('div');
    if(i/satage_list.length < 1){
      one_satage.setAttribute("id","link_id_" + get_list[satage_list[i%satage_list.length]].stage_id);
    }
    satage_div.classList.add(get_list[satage_list[i%satage_list.length]].stage_id);
    satage_div.classList.add("satage_div");
    
    var satage_level = document.createElement('div');
    if(level){
      satage_level.classList.add("satage_level");
    }
    var newContent = document.createTextNode("Level " + level); 
    satage_level.appendChild(newContent);
    
    var satage_clear = document.createElement('div');
    satage_clear.classList.add("satage_status");
    if(localStorage[get_list[satage_list[i%satage_list.length]].stage_id]){
      satage_clear.classList.add("satage_clear");
    }
    
    var satage_name = document.createElement('div');
    satage_name.classList.add("satage_name");
    newContent = document.createTextNode(get_list[satage_list[i%satage_list.length]].name); 
    satage_name.appendChild(newContent);
    
    var satage_info = document.createElement('div');
    satage_info.classList.add("satage_info");
    if(get_list[satage_list[i%satage_list.length]].info){
      newContent = document.createTextNode(get_list[satage_list[i%satage_list.length]].info); 
    }
    else{
      newContent = document.createTextNode("");
    }
    satage_info.appendChild(newContent);
    
    satage_div.appendChild(satage_level);
    satage_div.appendChild(satage_clear);
    satage_div.appendChild(satage_name);
    satage_div.appendChild(satage_info);
    
    satage_div.onclick = function(e) {
      var satageId = this.classList[0];
      for(var select_id of satage_list){
        for(var select_class_list of document.getElementsByClassName(select_id)){
          if(satageId == select_id){
            select_class_list.classList.add("satage_select_on");
          }
          else if(select_class_list.classList.contains("satage_select_on")){
            select_class_list.classList.remove("satage_select_on");
          }
        }
      }
      satage_info_create(satageId,get_list);
      e.stopPropagation();
    };
    
    one_satage.appendChild(satage_div);
    
    document.getElementById('satage_list').appendChild(one_satage);
  }
  
  var loop = document.getElementById('satage_list');
  
  loop.onscroll = function(){
    var scrollTop = this.scrollTop;
    if(0 >= scrollTop){
      this.scrollTo( 0, satage_list.length*80-1 ) ;
    }
    else if(satage_list.length*80 < scrollTop){
      this.scrollTo( 0, 1 ) ;
    }
  }
  document.getElementById('satage_list').scrollTo( 0,1 ) ;
}

function satage_info_create(id,get_list){
  
  var data = get_list[id].map_data;
  var c = document.getElementById("map_table");
  if(c){
      c.parentNode.removeChild(c);
  }
  var rows=[];
  var table = document.createElement("table");
  table.setAttribute("id","map_table");
  
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
      }
      else if(data[i][j] == 4){
        cell.classList.add("hot_img");
      }
      else if(data[i][j] == 34){
        cell.classList.add("ch_img");
      }
      else if(data[i][j] == 43){
        cell.classList.add("ch_img");
      }
    }
  }
  
  c = document.getElementById("satage_join_div");
  if(c){
      c.parentNode.removeChild(c);
  }
  

  
  document.getElementById("satage_info_name").textContent = get_list[id].name;
  
  if(get_list[id].mode == "gethart"){
    document.getElementById("satage_info_hart_data").textContent = get_list[id].get_hart_value;
    if(document.getElementById("satage_info_hart").classList.contains('display_off')){
      document.getElementById("satage_info_hart").classList.remove("display_off");
    }
    
    if(!document.getElementById("satage_info_put").classList.contains('display_off')){
      document.getElementById("satage_info_put").classList.add("display_off");
    }
  }
  else if(get_list[id].mode == "puthot"){
    if(document.getElementById("satage_info_put").classList.contains('display_off')){
      document.getElementById("satage_info_put").classList.remove("display_off");
    }
    
    if(!document.getElementById("satage_info_hart").classList.contains('display_off')){
      document.getElementById("satage_info_hart").classList.add("display_off");
    }
  }
  document.getElementById("satage_info_block_data").textContent = get_list[id].block_limit;
  document.getElementById("satage_info_turn_data").textContent = get_list[id].turn;
  
  
  
  
  var satage_join_div = document.createElement('div');
  satage_join_div.setAttribute("id","satage_join_div");
  
  var satage_join_link = document.createElement('a');
  satage_join_link.classList.add("satage_join_link");
  satage_join_link.href = "/tutorial?stage=" + id;
  //server_join_link.target = "_blank";
  satage_join_link.innerText = "はじめる";
  	
  satage_join_div.appendChild(satage_join_link);
  	
  
  document.getElementById("satage_map").appendChild(table);
  document.getElementById("satage_info").appendChild(satage_join_div);
  
  document.getElementById("satage_map").classList.remove("display_off");
  document.getElementById("satage_info_condition").classList.remove("display_off");
  document.getElementById("satage_join_div").classList.remove("display_off");
  document.getElementById("satage_info_name").classList.remove("display_off");
  document.getElementById("menu_area").classList.add("select_back");
}


window.addEventListener('load', function() {
    getStageList();
})

function getStageList() {
    var url = './../api/tutorial';
    fetch(url)
    .then(function (data) {
        return data.json(); 
    })
    .then(function (json) {
        createStageList(json);
    });
}

document.getElementById("menu_area").onclick = function(){
  document.getElementById("satage_map").classList.add("display_off");
  document.getElementById("satage_info_condition").classList.add("display_off");
  document.getElementById("satage_join_div").classList.add("display_off");
  document.getElementById("satage_info_name").classList.add("display_off");
  document.getElementById("menu_area").classList.remove("select_back");
}

document.getElementById("satage_info").onclick = function(e){
  e.stopPropagation();
}

document.getElementById("satage_info_name").onclick = function(e){
  e.stopPropagation();
}