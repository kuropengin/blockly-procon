
Blockly.JavaScript['server_connect'] = function(block) {
  var text_name = block.getFieldValue('name');
  var dropdown_room_id = block.getFieldValue('room_id');
  var statements_my_turn = Blockly.JavaScript.statementToCode(block, 'my_turn');
  var statements_other_turn = Blockly.JavaScript.statementToCode(block, 'other_turn');
  // TODO: Assemble JavaScript into code variable.
  
  var code = '';
  var stc = [];
  if(!servar_status()){
    if(!text_name){
      text_name = "NoName"
    }
    code += 'join("' + dropdown_room_id + '","' + text_name + '");\n';
  }
  if(my_map_data.length){
    code += 'if('+ turn_ready() +'){\n'
          + '  action_turn_hiyasinsu_kuropengin = true;\n'
          + '  map_data_hiyasinsu_kuropengin = [' + my_map_data + '];\n'
          + statements_my_turn 
          + '}\nelse{\n' 
          + statements_other_turn 
          + '}\n';    
  }
  else{
    code += 'if('+ turn_ready() +'){\n'
          + '  action_turn_hiyasinsu_kuropengin = true;\n'
          + statements_my_turn 
          + '}\nelse{\n' 
          + statements_other_turn 
          + '}\n';  
  }


  return code;
};



Blockly.JavaScript['move_player'] = function(block) {
  var dropdown_move = block.getFieldValue('move');
  // TODO: Assemble JavaScript into code variable.
  var code = 'if(action_turn_hiyasinsu_kuropengin){\n'
            +'  move_player("' + dropdown_move + '");\n'
            +'  action_turn_hiyasinsu_kuropengin = false;\n'
            +'}\n';
  return code;
};

Blockly.JavaScript['look'] = function(block) {
  var dropdown_look = block.getFieldValue('look').toString();
  var code = '';

  if(my_turn){
    var x_range = [];
    var y_range = [];
    
    if(dropdown_look == "top"){
      x_range = [-1,0,1];
      y_range = [-3,-2,-1];
      console.log("top");
    }else if(dropdown_look == "bottom"){
      x_range = [1,0,-1];
      y_range = [3,2,1];
      console.log("bottom");
    }else if(dropdown_look == "left"){
      x_range = [-3,-2,-1];
      y_range = [1,0,-1];
      console.log("left");
    }else{
      x_range = [3,2,1];
      y_range = [-1,0,1];
      console.log("right");
    }
    var look_map_data = [];
    
    for(var y of y_range){
      for(var x of x_range){
        if(0 > (now_x + x) || (load_map_size_x - 1) < (now_x + x) || 0 > (now_y + y) || (load_map_size_y - 1) < (now_y + y)){
          look_map_data.push(1);
        }
        else{
          look_map_data.push(tmp_map_data[now_y + y][now_x + x]); 
        }
      }
    }
    code = 'if(action_turn_hiyasinsu_kuropengin){\n'
            +'  look("'+ dropdown_look +'");\n'
            +'  map_data_hiyasinsu_kuropengin = [' + look_map_data + '];\n'
            +'  action_turn_hiyasinsu_kuropengin = false;\n'
            +'}\n';
  }
  return code;
};

Blockly.JavaScript['search'] = function(block) {
  var dropdown_search = block.getFieldValue('search').toString();
  // TODO: Assemble JavaScript into code variable.
  var code = '';

  if(my_turn){
    var x_range = [];
    var y_range = [];

    if(dropdown_search == "top"){
      x_range = [0];
      y_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
    }else if(dropdown_search == "bottom"){
      x_range = [0];
      y_range = [1,2,3,4,5,6,7,8,9];
    }else if(dropdown_search == "left"){
      x_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
      y_range = [0];
    }else{
      x_range = [1,2,3,4,5,6,7,8,9];
      y_range = [0];
    }
    var search_map_data = [];
    
    for(var y of y_range){
      for(var x of x_range){
        if(0 > (now_x + x) || (load_map_size_x - 1) < (now_x + x) || 0 > (now_y + y) || (load_map_size_y - 1) < (now_y + y)){
          search_map_data.push(1);
        }
        else{
          search_map_data.push(tmp_map_data[now_y + y][now_x + x]); 
        }
      }
    }
    code = 'if(action_turn_hiyasinsu_kuropengin){\n'
            +'  search("'+ dropdown_search +'");\n'
            +'  map_data_hiyasinsu_kuropengin = [' + search_map_data + '];\n'
            +'  action_turn_hiyasinsu_kuropengin = false;\n'
            +'}\n';
  }
  return code;
};

Blockly.JavaScript['get_value'] = function(block) {
  var dropdown_get_value = block.getFieldValue('get_value') - 1;
  // TODO: Assemble JavaScript into code variable.
  var code = '';
  if(my_map_data.length){
    code = 'map_data_hiyasinsu_kuropengin['+ dropdown_get_value +']';
  }
  else{
    code = 99;
  }

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['put_wall'] = function(block) {
  var dropdown_put_wall = block.getFieldValue('put_wall').toString();
  // TODO: Assemble JavaScript into code variable.
  var code = 'if(action_turn_hiyasinsu_kuropengin){\n'
            +'  put_wall("' + dropdown_put_wall + '");\n'
            +'  action_turn_hiyasinsu_kuropengin = false;\n'
            +'}\n';
  return code;
};

Blockly.JavaScript['wait'] = function(block) {
  var seconds = Number(block.getFieldValue('seconds'));
  var code = 'wait(' + seconds + ');\n';
  return code;
};
