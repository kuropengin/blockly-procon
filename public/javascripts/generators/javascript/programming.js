Blockly.JavaScript['wait'] = function(block) {
  var seconds = Number(block.getFieldValue('seconds'));
  var code = 'wait(' + seconds + ');\n';
  return code;
};

Blockly.JavaScript['server_join'] = function(block) {
  var dropdown_room_id = block.getFieldValue('room_id');
  var text_name = block.getFieldValue('name');
  // TODO: Assemble JavaScript into code variable.
  
  if(!text_name){
      text_name = "NoName"
  }
  var code = 'join("' + dropdown_room_id + '","' + text_name + '");\n';
  return code;
};

Blockly.JavaScript['get_ready'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'map_data_hiyasinsu_kuropengin = get_ready();\n';
  return code;
};

Blockly.JavaScript['move_player'] = function(block) {
  var dropdown_move = block.getFieldValue('move');
  // TODO: Assemble JavaScript into code variable.
  var code = 'move_player("' + dropdown_move + '");\n';
  return code;
};

Blockly.JavaScript['look'] = function(block) {
  var dropdown_look = block.getFieldValue('look').toString();
  var code = 'map_data_hiyasinsu_kuropengin = look("'+ dropdown_look +'");\n';
  return code;
};

Blockly.JavaScript['search'] = function(block) {
  var dropdown_look = block.getFieldValue('search').toString();
  var code = 'map_data_hiyasinsu_kuropengin = search("'+ dropdown_look +'");\n';
  return code;
};

Blockly.JavaScript['put_wall'] = function(block) {
  var dropdown_put_wall = block.getFieldValue('put_wall').toString();
  // TODO: Assemble JavaScript into code variable.
  var code = 'put_wall("' + dropdown_put_wall + '");\n';
  return code;
};

Blockly.JavaScript['get_value'] = function(block) {
  var dropdown_get_value = block.getFieldValue('get_value');
  // TODO: Assemble JavaScript into code variable.
  var code = 'valueNum(map_data_hiyasinsu_kuropengin['+ dropdown_get_value +'])';

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['if_value'] = function(block) {
  var dropdown_map_value = block.getFieldValue('map_value');
  var dropdown_map_item = block.getFieldValue('map_item');
  // TODO: Assemble JavaScript into code variable.
  var code = 'map_data_hiyasinsu_kuropengin['+ dropdown_map_value +'] == ' + dropdown_map_item + '';
  return [code, Blockly.JavaScript.ORDER_NONE];
};