function createServarList(get_list){
  
  var servar_list = [];
      
  for(var server in get_list){
    servar_list.push(server);
  }
  
  var h = document.getElementById('watching_list').clientHeight;
  var div_num = Math.ceil(h/80);
  
  
  if(servar_list.length >= div_num){
    div_num = servar_list.length*2;
  }
  else{
    div_num = Math.ceil(h*2/80);
  }
  
  for(var i=0; i < div_num; i++){
    var one_servar_div = document.createElement('div');
    one_servar_div.classList.add("one_watching_servar");
    
    var vs = "player";
    if(get_list[servar_list[i%servar_list.length]].cpu){
      vs = "cpu"
    }
    
    
    var servar_div = document.createElement('div');
    if(i/servar_list.length < 1){
      one_servar_div.setAttribute("id","link_id_" + get_list[servar_list[i%servar_list.length]].room_id);
    }
    servar_div.classList.add(get_list[servar_list[i%servar_list.length]].room_id);
    servar_div.classList.add("watching_server_div");
    
    var server_vs = document.createElement('div');
    if(vs == "player"){
      server_vs.classList.add("server_vs_player");
    }
    else{
      server_vs.classList.add("server_vs_cpu");
    }
    var newContent = document.createTextNode("VS " + vs); 
    server_vs.appendChild(newContent);
    
    var server_name = document.createElement('div');
    server_name.classList.add("server_name");
    newContent = document.createTextNode(get_list[servar_list[i%servar_list.length]].name); 
    server_name.appendChild(newContent);
    
    var server_id = document.createElement('div');
    server_id.classList.add("server_id");
    newContent = document.createTextNode(get_list[servar_list[i%servar_list.length]].room_id); 
    server_id.appendChild(newContent);
    
    servar_div.appendChild(server_vs);
    servar_div.appendChild(server_name);
    servar_div.appendChild(server_id);
    
    servar_div.onclick = function(e) {
      var serverId = this.classList[0];
      for(var select_id of servar_list){
        for(var select_class_list of document.getElementsByClassName(select_id)){
          if(serverId == select_id){
            select_class_list.classList.add("server_select_on");
          }
          else if(select_class_list.classList.contains("server_select_on")){
            select_class_list.classList.remove("server_select_on");
          }
        }
      }
      server_info(serverId,get_list);
      e.stopPropagation();
    };
    
    one_servar_div.appendChild(servar_div);
    
    document.getElementById('watching_list').appendChild(one_servar_div);
  }
  
  var loop = document.getElementById('watching_list');
  
  loop.onscroll = function(){
    var scrollTop = this.scrollTop;
    if(0 >= scrollTop){
      this.scrollTo( 0, servar_list.length*80-1 ) ;
    }
    else if(servar_list.length*80 < scrollTop){
      this.scrollTo( 0, 1 ) ;
    }
  }
  document.getElementById('watching_list').scrollTo( 0,1 ) ;
  
}

function server_info(id,get_list){
  
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
  
  
  c = document.getElementById("server_info_div");
  if(c){
      c.parentNode.removeChild(c);
  }
  
  c = document.getElementById("server_join_div");
  if(c){
      c.parentNode.removeChild(c);
  }

  c = document.getElementById("server_watch_div");
  if(c){
      c.parentNode.removeChild(c);
  }
  
  c = document.getElementById("server_info_name");
  if(c){
      c.parentNode.removeChild(c);
  }
  
  
  var server_info_name = document.createElement('div');
  server_info_name.setAttribute("id","server_info_name");
  var newContent = document.createTextNode(get_list[id].name); 
  server_info_name.appendChild(newContent);
  
  
  var server_info_div = document.createElement('div');
  server_info_div.setAttribute("id","server_info_div");
  
  var server_info_title = document.createElement('span');
  newContent = document.createTextNode(lng_list["SERVER_INFO"]); 
  server_info_title.appendChild(newContent);
  
  var server_info_id = document.createElement('div');
  server_info_id.setAttribute("id","server_info_id");
  newContent = document.createTextNode(get_list[id].room_id); 
  server_info_id.appendChild(newContent);
  
  var server_info_map = document.createElement('div');
  server_info_map.setAttribute("id","server_info_map");
  var map_status = lng_list["FIXITY"];
  if(!get_list[id].map_data.length){
    table.classList.add("auto_create_map");
    map_status = lng_list["AUTOMATIC_GENERATION"];
    if(get_list[id].auto_symmetry){
      map_status += lng_list["SYMMETRY"];
    }
    else{
      map_status += lng_list["RANDOM"];
    }
  }
  newContent = document.createTextNode(map_status); 
  server_info_map.appendChild(newContent);
  
  var server_info_turn = document.createElement('div');
  server_info_turn.setAttribute("id","server_info_turn");
  var turn_status = lng_list["CONNECTION_ORDER"];
  if(get_list[id].cpu){
    turn_status = lng_list["FIXITY"];
    if(get_list[id].cpu.turn == "cool"){
      turn_status += lng_list["TURN_H"];
    }
    else{
      turn_status += lng_list["TURN_C"];
    }
  }
  newContent = document.createTextNode(turn_status); 
  server_info_turn.appendChild(newContent);
  
  server_info_div.appendChild(server_info_title);
  server_info_div.appendChild(server_info_id);
  server_info_div.appendChild(server_info_map);
  server_info_div.appendChild(server_info_turn);
  
  
  var server_join_div = document.createElement('div');
  server_join_div.setAttribute("id","server_join_div");
  
  var server_join_link = document.createElement('a');
  server_join_link.classList.add("server_join_link");
  server_join_link.href = "/match?room_id=" + id;
  server_join_link.innerText = lng_list["MATCH"];	
  server_join_div.appendChild(server_join_link);

  var server_watch_div = document.createElement('div');
  server_watch_div.setAttribute("id","server_watch_div");
  
  var server_watch_link = document.createElement('a');
  server_watch_link.classList.add("server_join_link");
  server_watch_link.href = "/watching?room_id=" + id;
  server_watch_link.innerText = lng_list["WATCHING"];	
  server_watch_div.appendChild(server_watch_link);
  	
  
  document.getElementById("watching_info").appendChild(table);
  document.getElementById("watching_info").appendChild(server_info_div);
  document.getElementById("watching_info").appendChild(server_join_div);
  document.getElementById("watching_info").appendChild(server_watch_div);
  document.getElementById("menu_area").appendChild(server_info_name);
  document.getElementById("menu_area").classList.add("select_back");
}


window.addEventListener('load', function() {
    getServarList();
})

function getServarList() {
    var url = './../api/game';
    fetch(url)
    .then(function (data) {
        return data.json(); 
    })
    .then(function (json) {
        createServarList(json);
    });
}

