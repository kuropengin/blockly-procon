Blockly.JavaScript.addReservedWords('exit');


var myInterpreter = null;
var runner;
var map_data_hiyasinsu_kuropengin = [0,0,0,0,0,0,0,0,0];


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


Blockly.JavaScript.addLoopTrap("infinite_loop");


function initApi(interpreter, scope) {
  // Add an API function for the alert() block, generated for "text_print" blocks.
  
  interpreter.connectObject(scope, "map_data_hiyasinsu_kuropengin", map_data_hiyasinsu_kuropengin);
  
  
  
  var wrapper = function(text) {
    text.toString();
    //console.log(text);
  };
  interpreter.setProperty(scope, 'alert',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for the prompt() block.
  var wrapper = function(text,callback) {
    text = text ? text.toString() : '';
    self_prompt_b(text,callback);
  };
  interpreter.setProperty(scope, 'prompt',
      interpreter.createAsyncFunction(wrapper));

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
    user.chara = query_list.chara;
    socket.emit("player_join_match", user);
    
    servar_connect_status = true;
  };
  interpreter.setProperty(scope, 'join',
      interpreter.createNativeFunction(wrapper));
      
  var wrapper = function(direction,callback) {
    if (my_turn){
      direction = direction ? direction.toString() : '';
      look_search_data = false;
      var getDate =function(){
        if (look_search_data) {
          map_data_hiyasinsu_kuropengin = look_search_data;
          callback(look_search_data.join(''));
        }
        else if(myInterpreter){
          socket.emit("move_player",direction);
          setTimeout(getDate,100);
        }
      };
      getDate();
    }
    else{
      callback(map_data_hiyasinsu_kuropengin.join(''));
    }
  };
  interpreter.setProperty(scope, 'move_player',
      interpreter.createAsyncFunction(wrapper));
      
      
  var wrapper = function(direction,callback) {
    if (my_turn){
      direction = direction ? direction.toString() : '';
      look_search_data = false;
      var getDate =function(){
        if (look_search_data) {
          map_data_hiyasinsu_kuropengin = look_search_data;
          callback(look_search_data.join(''));
        }
        else if(myInterpreter){
          socket.emit("put_wall",direction);
          setTimeout(getDate,100);
        }
      };
      getDate();
    }
    else{
      callback(map_data_hiyasinsu_kuropengin.join(''));
    }
  };
  interpreter.setProperty(scope, 'put_wall',
      interpreter.createAsyncFunction(wrapper));
  

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
        map_data_hiyasinsu_kuropengin = my_turn;
        callback(my_turn.join(''));
      }
      else if(myInterpreter){
        socket.emit("get_ready");
        setTimeout(getDate,200);
      } 
    };
    getDate();
  };
  interpreter.setProperty(scope, 'get_ready',
      interpreter.createAsyncFunction(wrapper));
      
  var wrapper = function(direction,callback) {
    if (my_turn){
      look_search_data = false;
      var getDate =function(){
        if (look_search_data) {
          map_data_hiyasinsu_kuropengin = look_search_data;
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
      var getDate =function(){
        if (look_search_data) {
          map_data_hiyasinsu_kuropengin = look_search_data;
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

  generateUiCodeAndLoadIntoInterpreter();
}

function generateUiCodeAndLoadIntoInterpreter() {
  Blockly.JavaScript.STATEMENT_PREFIX = '';
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '';
  
  latestCode = Blockly.JavaScript.workspaceToCode(Code.workspace);
}

function generateCodeAndLoadIntoInterpreter() {
  // Generate JavaScript code and parse it.
  
  
  if(localStorage["LOOP_STATUS"]){
    if(localStorage["LOOP_STATUS"] == "on"){
      var LoopTrap = 1000;
      Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if(--LoopTrap == 0) throw "Infinite loop.";\n';
      latestCode = Blockly.JavaScript.workspaceToCode(Code.workspace);
      latestCode = "var LoopTrap = " + LoopTrap + ";\n" + latestCode;
    }
  }
  
      
}

function saveCodelocalStorage() {
  var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
  var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  
  if(localStorage["AUTO_SAVE"]){
    if(localStorage["AUTO_SAVE"] == "on"){
      localStorage.setItem("LastRun", xmlText); 
    }
  }
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
  map_data_hiyasinsu_kuropengin = [0,0,0,0,0,0,0,0,0];
}

var step_flag = false;
if(localStorage["LOWSPEED_MODE"]){
  if(localStorage["LOWSPEED_MODE"] == "on"){
    step_flag = true;
  }
  else{
    step_flag = false;
  }
}
else{
  localStorage["LOWSPEED_MODE"] == "off";
}

Code.runJS = function(){
  if (!myInterpreter) {
    
    resetStepUi(true);
    
    setTimeout(function() {
      highlightPause = false;
      generateCodeAndLoadIntoInterpreter();
      saveCodelocalStorage();
      
      //console.log(latestCode);
      
      myInterpreter = new ObjInterpreter(latestCode, initApi);
      runner = function() {
        var hasMore;
        if (myInterpreter) {
          try{
            if(step_flag){
              hasMore = myInterpreter.step();
            }
            else{
              hasMore = myInterpreter.run();
            }
            
            if (hasMore) {
              setTimeout(runner,10);
            }
            else {
              resetInterpreter();
              resetVar();
              resetStepUi(false);
            }
          }
          catch(e){
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
    resetInterpreter();
    resetStepUi(false);
  }
};







function self_prompt(message,callback){
  var input_text="";
  var pdiv = document.createElement("div");
  pdiv.setAttribute("id","input_text_area");
  
  var pmdiv = document.createElement("div"); 
  pmdiv.setAttribute("id","input_text_message");
  var newContent = document.createTextNode(message); 
  pmdiv.appendChild(newContent);
  pdiv.appendChild(pmdiv);
  
  var pidiv = document.createElement("input");
	pidiv.setAttribute("type","text"); 
	pidiv.setAttribute("maxlength","25"); 
	pidiv.setAttribute("id","input_text_form");
	pdiv.appendChild(pidiv);
	
	var pddiv = document.createElement("div"); 
  pddiv.setAttribute("id","input_text_button");
  
  var podiv = document.createElement("div"); 
  podiv.setAttribute("id","input_text_ok");
  var newContent = document.createTextNode("OK"); 
  podiv.appendChild(newContent);
  
  var input_text_ok = function(){
      input_text = "" + document.getElementById("input_text_form").value;
      var c = document.getElementById("input_text_area");
      if(c){
          c.parentNode.removeChild(c);
      }
      callback(input_text);
  }
  podiv.addEventListener('click', input_text_ok, true);
  podiv.addEventListener('touchend', input_text_ok, true);
  
  var pcdiv = document.createElement("div"); 
  pcdiv.setAttribute("id","input_text_cancel");
  var newContent = document.createTextNode("キャンセル"); 
  pcdiv.appendChild(newContent);
  
  var input_text_cancel = function(){
      var c = document.getElementById("input_text_area");
      if(c){
          c.parentNode.removeChild(c);
      }
      callback(false);
  }
  pcdiv.addEventListener('click', input_text_cancel, true);
  pcdiv.addEventListener('touchend', input_text_cancel, true);
  
  pddiv.appendChild(podiv);
  pddiv.appendChild(pcdiv);
  pdiv.appendChild(pddiv);
	
	document.body.appendChild(pdiv);
	
};


function self_prompt_b(message,callback){
  var input_text="";
  var pdiv = document.createElement("div");
  pdiv.setAttribute("id","input_text_area");
  
  var pmdiv = document.createElement("div"); 
  pmdiv.setAttribute("id","input_text_message");
  var newContent = document.createTextNode(message); 
  pmdiv.appendChild(newContent);
  pdiv.appendChild(pmdiv);
  
  var pidiv = document.createElement("input");
	pidiv.setAttribute("type","text"); 
	pidiv.setAttribute("maxlength","25"); 
	pidiv.setAttribute("id","input_text_form");
	pdiv.appendChild(pidiv);
	
	var pddiv = document.createElement("div"); 
  pddiv.setAttribute("id","input_text_button");
  
  var podiv = document.createElement("div"); 
  podiv.setAttribute("id","input_text_ok");
  var newContent = document.createTextNode("OK"); 
  podiv.appendChild(newContent);
  
  var input_text_ok = function(){
      input_text = "" + document.getElementById("input_text_form").value;
      var c = document.getElementById("input_text_area");
      if(c){
          c.parentNode.removeChild(c);
      }
      callback(input_text);
  }
  podiv.addEventListener('click', input_text_ok, true);
  podiv.addEventListener('touchend', input_text_ok, true);
  
  var pcdiv = document.createElement("div"); 
  pcdiv.setAttribute("id","input_text_cancel");
  var newContent = document.createTextNode("キャンセル"); 
  pcdiv.appendChild(newContent);
  
  var input_text_cancel = function(){
      var c = document.getElementById("input_text_area");
      if(c){
          c.parentNode.removeChild(c);
      }
      callback('');
  }
  pcdiv.addEventListener('click', input_text_cancel, true);
  pcdiv.addEventListener('touchend', input_text_cancel, true);
  
  pddiv.appendChild(podiv);
  pddiv.appendChild(pcdiv);
  pdiv.appendChild(pddiv);
	
	document.body.appendChild(pdiv);
	
};

Blockly.prompt = function(msg, defaultValue, callback){
  self_prompt_b(msg,callback)
}


