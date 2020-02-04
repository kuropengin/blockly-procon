Blockly.JavaScript.addReservedWords('exit');


var outputArea = document.getElementById('output');
var runButton = document.getElementById('runButton');
var myInterpreter = null;
var runner;
var map_data_hiyasinsu_kuropengin = false;


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




function initApi(interpreter, scope) {
  // Add an API function for the alert() block, generated for "text_print" blocks.
  
  interpreter.connectObject(scope, "map_data_hiyasinsu_kuropengin", map_data_hiyasinsu_kuropengin);
  
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
    
    var user = {};
    user.room_id = id;
    user.name = name;
    socket.emit("player_join", user);
  };
  interpreter.setProperty(scope, 'join',
      interpreter.createNativeFunction(wrapper));
      
  var wrapper = function(direction) {
    direction = direction ? direction.toString() : '';
    socket.emit("move_player", direction);
    my_turn = false;
  };
  interpreter.setProperty(scope, 'move_player',
      interpreter.createNativeFunction(wrapper)); 
      
  var wrapper = function(direction) {
    direction = direction ? direction.toString() : '';
    socket.emit("put_wall", direction);
    my_turn = false;
  };
  interpreter.setProperty(scope, 'put_wall',
      interpreter.createNativeFunction(wrapper)); 
    

  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return +text;
  };
  interpreter.setProperty(scope, 'valueNum',
      interpreter.createNativeFunction(wrapper));
      

  
  var wrapper = function(callback) {
    my_turn = false;
    var getDate =function(){
      if (my_turn) {
        callback(my_turn.join(''));
      }
      else if(myInterpreter){
        socket.emit("get_ready");
        setTimeout(getDate,100);
      } 
    };
    getDate();
  };
  interpreter.setProperty(scope, 'get_ready',
      interpreter.createAsyncFunction(wrapper));
      
  var wrapper = function(direction,callback) {
    if (my_turn){
      look_search_data = false;
      my_turn = false;
      var getDate =function(){
        if (look_search_data) {
          callback(look_search_data.join(''));
        }
        else if(myInterpreter){
          socket.emit("look",direction);
          setTimeout(getDate,100);
        }
      };
      getDate();
    }
    else{
      callback(map_data_hiyasinsu_kuropengin.join(''));
    }
  };
  interpreter.setProperty(scope, 'look',
      interpreter.createAsyncFunction(wrapper));
      
  var wrapper = function(direction,callback) {
    if (my_turn){
      look_search_data = false;
      my_turn = false;
      var getDate =function(){
        if (look_search_data) {
          callback(look_search_data.join(''));
        }
        else if(myInterpreter){
          socket.emit("search",direction);
          setTimeout(getDate,100);
        } 
      };
      getDate();
    }
    else{
      callback(map_data_hiyasinsu_kuropengin.join(''));
    }
  };
  interpreter.setProperty(scope, 'search',
      interpreter.createAsyncFunction(wrapper));
      
      
  
}


var highlightPause = false;
var latestCode = '';

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
  
  generateUiCodeAndLoadIntoInterpreter();
}

function generateUiCodeAndLoadIntoInterpreter() {
  Blockly.JavaScript.STATEMENT_PREFIX = '';
  latestCode = Blockly.JavaScript.workspaceToCode(Code.workspace);
}

function generateCodeAndLoadIntoInterpreter() {
  // Generate JavaScript code and parse it.
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  latestCode = Blockly.JavaScript.workspaceToCode(Code.workspace);
}

function saveCodelocalStorage() {
  var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
  var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  
  localStorage.setItem("LastRun", xmlText); 
}

function resetInterpreter() {
  myInterpreter = null;
  if (runner) {
    clearTimeout(runner);
    runner = null;
  }
  if (runner) {
    clearTimeout(runner);
    runner = null;
  }
}

function resetVar(){
  if(servar_connect_status){
    socket.emit("leave_room");
  }
  my_turn = false;
  servar_connect_status = false;
  map_data_hiyasinsu_kuropengin = false;
}


Code.runJS = function(){
  if (!myInterpreter) {

    resetStepUi(true);
    runButton.disabled = 'disabled';
    
    setTimeout(function() {
      highlightPause = false;
      generateCodeAndLoadIntoInterpreter();
      saveCodelocalStorage();
      
      myInterpreter = new ObjInterpreter(latestCode, initApi);
      runner = function() {
        if (myInterpreter) {
          //var hasMore = myInterpreter.run();
          var hasMore = myInterpreter.run();
          if (hasMore) {
            setTimeout(runner,100);
          }
          else {
            outputArea.value += '\n\n<< Program complete >>';
            resetInterpreter();
            resetVar();
            resetStepUi(false);
          }
        }
      };
      runner();
    }, 100);
    return;
  }
};


Code.stopJS = function(){
  if (myInterpreter) {
    clearTimeout();
    resetVar();
    runButton.disabled = 'disabled';
    outputArea.value += '\n\n<< Stop Program >>';
    resetInterpreter();
    resetStepUi(false);
  }
  var c = document.getElementById("ready_player");
  if(c){
      c.parentNode.removeChild(c);
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
