
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
  code += 'if('+ turn_ready() +'){\n'
        + statements_my_turn 
        + '}\nelse{\n' 
        + statements_other_turn 
        + '}\n';

  return code;
};



Blockly.JavaScript['move_player'] = function(block) {
  var dropdown_move = block.getFieldValue('move');
  // TODO: Assemble JavaScript into code variable.
  var code = 'move_player("' + dropdown_move + '");\n';
  return code;
};

Blockly.JavaScript['look'] = function(block) {
  var dropdown_look = block.getFieldValue('look');
  // TODO: Assemble JavaScript into code variable.
  var code = 'look("' + dropdown_look + '");\n';
  return code;
};

Blockly.JavaScript['search'] = function(block) {
  var dropdown_search = block.getFieldValue('search');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['get_value'] = function(block) {
  var dropdown_get_value = block.getFieldValue('get_value');
  // TODO: Assemble JavaScript into code variable.
  var code = my_map_data[parseInt(dropdown_get_value, 10)-1];

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['put_wall'] = function(block) {
  var dropdown_put_wall = block.getFieldValue('put_wall');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['wait'] = function(block) {
  var seconds = Number(block.getFieldValue('seconds'));
  var code = 'wait(' + seconds + ');\n';
  return code;
};
