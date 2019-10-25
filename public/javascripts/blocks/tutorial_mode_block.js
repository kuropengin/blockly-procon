Blockly.Blocks['tutorial_move_player'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["上","top"], ["下","bottom"], ["左","left"], ["右","right"]]), "move")
        .appendField("に移動する");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
