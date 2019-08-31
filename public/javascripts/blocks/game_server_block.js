
Blockly.Blocks['server_connect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(get_server_list), "room_id")
        .appendField("サーバに接続する");
    this.appendDummyInput()
        .appendField("プレイヤー名")
        .appendField(new Blockly.FieldTextInput(""), "name");
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("https://www.gstatic.com/codesite/ph/images/star_on.gif", 15, 15, "*"));
    this.appendDummyInput()
        .appendField("もし自分のターンなら");
    this.appendStatementInput("my_turn")
        .setCheck(null)
        .appendField("実行");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField("もし相手のターンなら");
    this.appendStatementInput("other_turn")
        .setCheck(null)
        .appendField("実行");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldImage("https://www.gstatic.com/codesite/ph/images/star_on.gif", 15, 15, "*"))
        .appendField("に戻る");
    this.setColour(195);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


Blockly.Blocks['move_player'] = {
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

Blockly.Blocks['look'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["上","top"], ["下","bottom"], ["左","left"], ["右","right"]]), "look")
        .appendField("の周りを見る");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['search'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["上","top"], ["下","bottom"], ["左","left"], ["右","right"]]), "search")
        .appendField("の遠くを見る");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['get_value'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"], ["4","4"], ["5","5"], ["6","6"], ["7","7"], ["8","8"], ["9","9"]]), "get_value")
        .appendField("マス目");
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setColour(195);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['put_wall'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["上","top"], ["下","bottom"], ["左","left"], ["右","right"]]), "put_wall")
        .appendField("にブロックを置く");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['wait'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0, 0, 60, 0.1), "seconds")
        .appendField("秒　待つ");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(195);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

