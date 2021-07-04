const fs = require('fs');

const jsonObject = JSON.parse(fs.readFileSync('./config/electron_conf.json', 'utf8'));

if(process.argv[2] == "true"){
    jsonObject.exe_mode = true;
}
else{
    jsonObject.exe_mode = false;
}

fs.writeFileSync('./config/electron_conf.json', JSON.stringify(jsonObject));