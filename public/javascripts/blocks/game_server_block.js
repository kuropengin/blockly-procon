
Blockly.Blocks['server_connect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(get_server_list), "room_id")
        .appendField("サーバに接続する");
    this.appendDummyInput()
        .appendField("プレイヤー名")
        .appendField(new Blockly.FieldTextInput(""), "name");
    this.appendDummyInput()
        .appendField("値の初期化");
    this.appendStatementInput("init_value")
        .setCheck(null);
    this.appendDummyInput();
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("https://www.gstatic.com/codesite/ph/images/star_on.gif", 15, 15, "*"))
        .appendField("　ゲームが終了するまで繰り返す");
    this.appendDummyInput()
        .appendField("もし自分のターンなら実行");
    this.appendStatementInput("my_turn")
        .setCheck(null);
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
        .appendField(new Blockly.FieldDropdown([["1","0"], ["2","1"], ["3","2"], ["4","3"], ["5","4"], ["6","5"], ["7","6"], ["8","7"], ["9","8"]]), "get_value")
        .appendField("マス目");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(195);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['if_value'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["1","0"], ["2","1"], ["3","2"], ["4","3"], ["5","4"], ["6","5"], ["7","6"], ["8","7"], ["9","8"]]), "map_value")
        .appendField("マス目が")
        .appendField(new Blockly.FieldDropdown([["なにもない","0"], ["ブロックがある","1"], ["ハートがある","2"], ["プレイヤーがいる","3"]]), "map_item")
        .appendField("なら");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
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

Blockly.Blocks['server_join'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["0","0"], ["1","1"], ["2","2"]]), "room_id")
        .appendField("にプレイヤー名")
        .appendField(new Blockly.FieldTextInput(""), "name")
        .appendField("で接続する");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(195);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['get_ready'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("自分のターンを待つ");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(195);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};