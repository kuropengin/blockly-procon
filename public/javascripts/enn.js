Blockly.JavaScript.addReservedWords('exit');

class ObjInterpreter extends Interpreter {
  constructor(code, initAlert) {
    super(code, initAlert);

    this._obj = {}; //store last valid scope
    this._result = null; // store last result from external function
  }

  getProperty(obj, name) {
    if ((obj == null) || !obj.isReal) {
      this._obj = obj;
      return super.getProperty(obj, name);
    }
    else {
      var member;
      member = obj.connectedObject[name.toString()];
      if ((member != null) && typeof member === "object") {
        return this._createConnectedObject(member); // return object
      }
      else if ((member != null) && typeof member === "function") {
        this._result = obj.connectedObject[name.toString()](); //run function (without attr)
        return super.getProperty(this._obj, 'proxy'); //return dummy function
      }
      else {
        return this.createPrimitive(member); // return primitve typ
      }
      
    }
  }

  setProperty(obj, name, value, opt_fixed, opt_nonenum) {
    if ((obj == null) || !obj.isReal) {
      return super.setProperty(obj, name, value, opt_fixed, opt_nonenum);
    }
    else {
      obj.connectedObject[name.toString()] = value;
    }
  }

  _createConnectedObject(obj) {
    var cobj;
    cobj = this.createObject(this.OBJECT);
    cobj.isReal = true;
    cobj.connectedObject = obj;
    return cobj;
  }

  connectObject(scope, name, obj) {
    this.setProperty(scope, name, this._createConnectedObject(obj, name));
  }
}





var outputArea = document.getElementById('output');
var runButton = document.getElementById('runButton');
var myInterpreter = null;
var runner;


var myObject = {
  x: false
};


function initApi(interpreter, scope) {
  // Add an API function for the alert() block, generated for "text_print" blocks.
  
  var wrapper = function(text) {
    text.toString();
    outputArea.value = outputArea.value + '\n' + text;
  };
  interpreter.setProperty(scope, 'alert',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for the prompt() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(prompt(text));
  };
  interpreter.setProperty(scope, 'prompt',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for highlighting blocks.
  var wrapper = function(id) {
    id = id ? id.toString() : '';
    return interpreter.createPrimitive(highlightBlock(id));
  };
  interpreter.setProperty(scope, 'highlightBlock',
      interpreter.createNativeFunction(wrapper));
      
  var wrapper = function() {
    var socket = io();
  };
  interpreter.setProperty(scope, 'io',
      interpreter.createNativeFunction(wrapper));
      
  var wrapper = function(id,name) {
    id = id ? id.toString() : '';
    name = name ? name.toString() : '';
    join(id,name);
  };
  interpreter.setProperty(scope, 'join',
      interpreter.createNativeFunction(wrapper));
      
  var wrapper = function(direction) {
    direction = direction ? direction.toString() : '';
    move_player(direction);
  };
  interpreter.setProperty(scope, 'move_player',
      interpreter.createNativeFunction(wrapper));    
   
  var wrapper = function(direction) {
    direction = direction ? direction.toString() : '';
    look(direction);
  };
  interpreter.setProperty(scope, 'look',
      interpreter.createNativeFunction(wrapper)); 
      
  var wrapper = function(direction) {
    direction = direction ? direction.toString() : '';
    search(direction);
  };
  interpreter.setProperty(scope, 'search',
      interpreter.createNativeFunction(wrapper)); 
  
  var wrapper = function(direction) {
    direction = direction ? direction.toString() : '';
    put_wall(direction);
  };
  interpreter.setProperty(scope, 'put_wall',
      interpreter.createNativeFunction(wrapper));    


  Blockly.JavaScript.addReservedWords('wait');
  
  var wrapper = interpreter.createAsyncFunction(
      function(timeInSeconds,callback) {
          setTimeout(callback, timeInSeconds * 1000);
      }
  );
  interpreter.setProperty(scope, 'wait', wrapper);
  
  
  interpreter.connectObject(scope, "outside", myObject);
  interpreter.connectObject(scope, "var_stor", var_stor);
  
}


var highlightPause = false;
var latestCode = '';
var var_stor = {};

function highlightBlock(id) {
  Code.workspace.highlightBlock(id);
  highlightPause = true;
}

function resetStepUi(clearOutput) {
  Code.workspace.highlightBlock(null);
  highlightPause = false;
  runButton.disabled = '';

  if (clearOutput) {
    outputArea.value = 'Program output:\n=================';
  }
}

function resetInterpreter() {
  myInterpreter = null;
  if (runner) {
    clearTimeout(runner);
    runner = null;
  }
}

function resetVarStor(){
  if(servar_connect_status){
    socket.emit("leave_room");
  }
  var_stor = {};
  my_turn = false;
  servar_connect_status = false;
  my_map_data = [];
}

var runspeed = 0;
var programming_mode = "";
try{
  if(satage_data){
    runspeed = 100;
    programming_mode = "t";
  }
  else{
    runspeed = 0;
    programming_mode = "p";
  }
}
catch(e){
  runspeed = 0;
  programming_mode = "p";
}

Code.runJS = function(){
  if (!myInterpreter) {
    if(!servar_status()){
      resetInterpreter();
      resetStepUi(true);
    }
    runButton.disabled = 'disabled';

    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    latestCode = Blockly.JavaScript.workspaceToCode(Code.workspace);
    
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    
    if(programming_mode == "p"){
      localStorage.setItem("LastRun", xmlText);
    }
    else if(programming_mode == "t"){
      makeTable("game_board");
    }
    
    var c1 = latestCode.split(/\r\n|\r|\n/)[0];
    if(c1.substr(0,3) === "var"){
      var c2 = '';
    	for(let i of c1.substring(4,c1.length-1).split(', ')) {
    	  if(!(i in var_stor)){
    		  var_stor[i] = null;
    	  }
    	  else{
    	    if(typeof(var_stor[i]) == "number"){
    	      c2 += ''+ i + ' = ' + var_stor[i] + ';'; 
    	    }
    	    else{
    	      c2 += ''+ i + ' = "' + var_stor[i] + '";'; 
    	    }
    	  }
    		latestCode += 'var_stor.'+ i + ' = ' + i + ';'; 
      }
      var c3 = latestCode.split(/\r\n|\r|\n/);//.splice(1,0,c2).join('\n');
      c3[1] = c2;
      latestCode = c3.join('\n');
    }
    
    if(!(latestCode.indexOf('join("') == -1) && !servar_status()){
      servar_connect_status = true;
      alert('サーバー接続ブロックを検出しました。\n誤動作防止のためサーバー接続ブロックに接続されたブロック以外は無視して実行されます。');
    }
    

    if(!var_stor["map_data_hiyasinsu_kuropengin"]){
      latestCode = 'var action_turn_hiyasinsu_kuropengin = false;\n' +  latestCode;
      latestCode = 'var map_data_hiyasinsu_kuropengin = [];\n' +  latestCode;
    }
    else{
      latestCode = 'var action_turn_hiyasinsu_kuropengin = [' + var_stor["action_turn_hiyasinsu_kuropengin"] + '];\n' +  latestCode;
      latestCode = 'var map_data_hiyasinsu_kuropengin = [' + var_stor["map_data_hiyasinsu_kuropengin"] + '];\n' +  latestCode;
    }
    if(my_map_data.length){
      latestCode = latestCode + 'var_stor.map_data_hiyasinsu_kuropengin = map_data_hiyasinsu_kuropengin;\n';
    }
    latestCode = latestCode + 'var_stor.action_turn_hiyasinsu_kuropengin = action_turn_hiyasinsu_kuropengin;\n';
    
    
    //console.log(latestCode);
    
    myInterpreter = new ObjInterpreter(latestCode, initApi);
    
    runner = function() {
      if (myInterpreter) {
        var hasMore
        try {
          hasMore = myInterpreter.step();
        }
        catch (e) {
          outputArea.value += '\n\n<< Program error >>\n' + e +'\n';
          Code.stopJS();
        }
        
        if (hasMore) {
          if(programming_mode == "p"){
            runner();
          }
          else{
            setTimeout(runner, 10);
          }
        }
        else {
          if(servar_connect_status){
            resetInterpreter();
            if(var_stor["action_turn_hiyasinsu_kuropengin"]){
              roop_run = setTimeout(Code.runJS,100);
            }
            if(next_my_trun){
              next_my_trun = false;
              roop_run = setTimeout(Code.runJS,100);
            }
            //Code.runJS();
          }
          else{
            outputArea.value += '\n\n<< Program complete >>';
            resetInterpreter();
            resetStepUi(false);
            if(programming_mode == "t"){
              endCode();
            }
          }
        }
      }
    };
    runner();
    
    
    /*
    setTimeout(function() {
      highlightPause = true;

      runner = function() {
        highlightPause = false;
        if (myInterpreter) {
          var hasMore = myInterpreter.step();
          
          if (hasMore) {
            setTimeout(runner, 1);
          } else {
            // Program is complete.
            if(servar_connect_status){
              resetInterpreter();
              setTimeout(Code.runJS, 1);
            }
            else{
              outputArea.value += '\n\n<< Program complete >>';
              resetInterpreter();
              resetStepUi(false);
            }
          }
        }
      };
      runner();
    }, 1);
    */
    return;
  }
};


Code.stopJS = function(){
  if (myInterpreter) {
    clearTimeout();
    resetVarStor();
    runButton.disabled = 'disabled';
    outputArea.value += '\n\n<< Stop Program >>';
    resetInterpreter();
    resetStepUi(false);
  }
  else if(servar_status()){
    resetVarStor();
    clearTimeout(roop_run);
    runButton.disabled = 'disabled';
    outputArea.value += '\n\n<< Stop Program >>';
    resetInterpreter();
    resetStepUi(false);
  }
  var c = document.getElementById("ready_player");
  if(c){
      c.parentNode.removeChild(c);
  }
  if(programming_mode == "t"){
    endCode();
  }
};

Code.download = function(){
  var xmlTextarea = document.getElementById('content_xml');
  var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
  var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  
  var userAgent = window.navigator.userAgent.toLowerCase();
  var webbrowser_check = 0;
  
  if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1){
    webbrowser_check = 1;
  }
  else if(userAgent.indexOf('edge') != -1) {
    webbrowser_check = 1;
  }
  else if(userAgent.indexOf('chrome') != -1) {
    webbrowser_check = 1;
  }
  else if(userAgent.indexOf('safari') != -1) {
    webbrowser_check = 0;
  }
  else if(userAgent.indexOf('firefox') != -1) {
    webbrowser_check = 1;
  }
  else if(userAgent.indexOf('opera') != -1) {
    webbrowser_check = 1;
  }
  else {
    webbrowser_check = 0;
  }
  
  if(webbrowser_check == 0){
    window.alert("ご利用のブラウザは本機能を使用できません");
  }
  else{
    var blob = new Blob([xmlText], {type: "application/octet-stream"}); 
    
    var file_name = window.prompt("ファイル名を入力してください", "");
    
    if(file_name){
      if(window.navigator.msSaveBlob)
      {
          // IE
          window.navigator.msSaveBlob(blob, file_name + ".xml");
      } else {
          // another
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.target = '_blank';
          a.download = file_name + ".xml";
          a.click();
      }
    }
  }
}


function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  console.log(e);
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom;
    var xmlText = contents.toString();
    
    try {
      xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
      window.alert("ファイルの読み込みに失敗しました");
    }
    if (xmlDom) {
      Code.workspace.clear();
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
    }
    
  };
  reader.readAsText(file);
}


document.getElementById('file_load').addEventListener('change', readSingleFile, false);


function initDataLoad(){

  var queryStr = window.location.search.slice(1);
      queries = {};

  if (!queryStr) {
    return queries;
  }

  queryStr.split('&').forEach(function(queryStr) {
    var queryArr = queryStr.split('=');
    queries[queryArr[0]] = queryArr[1];
  });

  if(queries.loaddata){
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom;
    var xmlText;
    try {
      xmlText = localStorage.getItem(queries.loaddata).toString();
      xmlDom = Blockly.Xml.textToDom(xmlText);
    }
    catch (e) {
      window.alert("ファイルの読み込みに失敗しました");
    }
    if (xmlDom) {
      Code.workspace.clear();
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
    }
  }
}
