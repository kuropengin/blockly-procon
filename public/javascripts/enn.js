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
    text = text ? text.toString() : '';
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
   
  var wrapper = function() {
    console.log(turn_ready());
    return false;//interpreter.createPrimitive(turn_ready());
  };
  interpreter.setProperty(scope, 'turn_ready',
      interpreter.createNativeFunction(wrapper)); 
  
  
  Blockly.JavaScript.addReservedWords('wait');
  
  var wrapper = interpreter.createAsyncFunction(
      function(timeInSeconds,callback) {
          // Delay the call to the callback.
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
  var_stor = {};
  my_turn = false;
  servar_connect_status = false;
}


Code.runJS = function(){
  if (!myInterpreter) {
    // First statement of this code.
    // Clear the program output.
    if(!servar_status()){
      resetStepUi(true);
    }
    runButton.disabled = 'disabled';

    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    latestCode = Blockly.JavaScript.workspaceToCode(Code.workspace);
    
    var c1 = latestCode.split(/\r\n|\r|\n/)[0];
    if(c1.substr(0,3) === "var"){
      var c2 = '';
    	for(let i of c1.substring(4,c1.length-1).split(', ')) {
    	  if(!var_stor[i]){
    		  var_stor[i] = null;
    	  }
    	  else{
    	    c2 += ''+ i + '=' + var_stor[i] + ';'; 
    	  }
    		latestCode += 'var_stor.'+ i + '=' + i + ';'; 
      }
      var c3 = latestCode.split(/\r\n|\r|\n/);//.splice(1,0,c2).join('\n');
      c3[1] = c2;
      latestCode = c3.join('\n');
    }
    
    if(!(latestCode.indexOf('join("') == -1) && !servar_status()){
      servar_connect_status = true;
      alert('サーバー接続ブロックを検出しました。\n誤動作防止のためサーバー接続ブロックに接続されたブロック以外は無視して実行されます。');
    }
    
    myInterpreter = new ObjInterpreter(latestCode, initApi);
    
    //alert('Ready to execute the following code\n' + '===================================\n' + latestCode);
    
    setTimeout(function() {
      highlightPause = true;

      runner = function() {
        highlightPause = false;
        if (myInterpreter) {
          var hasMore = myInterpreter.step();
          
          if (hasMore) {
            // Execution is currently blocked by some async call.
            // Try again later.
            
            setTimeout(runner, 10);
          } else {
            // Program is complete.
            if(servar_connect_status){
              resetInterpreter();
              setTimeout(Code.runJS, 50);
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
    return;
  }
};




Code.stopJS = function(){
  if (myInterpreter) {
    resetVarStor();
    runButton.disabled = 'disabled';
    outputArea.value += '\n\n<< Stop Program >>';
    resetInterpreter();
    resetStepUi(false);
  }
  else if(servar_status()){
    resetVarStor();
    runButton.disabled = 'disabled';
    outputArea.value += '\n\n<< Stop Program >>';
    resetInterpreter();
    resetStepUi(false);
  }
};