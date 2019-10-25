Blockly.JavaScript['tutorial_move_player'] = function(block) {
  var dropdown_move = block.getFieldValue('move');
  // TODO: Assemble JavaScript into code variable.
  var code = 'move_player("' + dropdown_move + '");\n';
  return code;
};