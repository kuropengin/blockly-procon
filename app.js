var createError = require('http-errors');
var express = require('express');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const logger = require('./bin/logger.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var menuProgrammingRouter = require('./routes/menu-programming');
var programmingRouter = require('./routes/programming');
var menuTutorialRouter = require('./routes/menu-tutorial');
var tutorialRouter = require('./routes/tutorial');
var menuWatchingRouter = require('./routes/menu-watching');
var watchingRouter = require('./routes/watching');

var app = express();


//socket.io
app.io = programmingRouter.io;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bgm',express.static(path.join(__dirname, 'load_data', 'bgm_data')));
app.use('/about/LICENSE',express.static(path.join(__dirname + '/LICENSE')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/menu-programming', menuProgrammingRouter);
app.use('/programming', programmingRouter);
app.use('/menu-tutorial', menuTutorialRouter);
app.use('/tutorial', tutorialRouter);
app.use('/menu-watching',menuWatchingRouter);
app.use('/watching',watchingRouter);



//API

//init load
const bgm_list = fs.readdirSync(path.join(__dirname, "load_data", "bgm_data"));

const game_server_list = fs.readdirSync(path.join(__dirname,  "load_data", "game_server_data"));
let game_server = {};
let join_list = [];
for(let gs of game_server_list){
    try{
        var temp_game_server = JSON.parse(fs.readFileSync(path.join(__dirname,  'load_data','game_server_data',gs), 'utf8'));
        if(temp_game_server.room_id){
            game_server[temp_game_server.room_id] = temp_game_server;
            join_list.push([temp_game_server.name,temp_game_server.room_id]);
        }
        else{
            logger.error('The format of the game server data is incorrect. Data to be loaded "' + gs + '"');
        }
    }
    catch(e){
        logger.error('Failed to read the game server data. Data to be loaded "' + gs + '"');
    }
}

const stage_data_list = fs.readdirSync(path.join(__dirname, "load_data", "tutorial_stage_data"));
let stage_data = {};
for(let sd of stage_data_list){
    try{
        var temp_stage_data = JSON.parse(fs.readFileSync(path.join(".","load_data","tutorial_stage_data",sd), 'utf8'));
        if(temp_stage_data.stage_id){
          stage_data[temp_stage_data.stage_id] = temp_stage_data;
        }
        else{
            logger.error('The format of the tutorial data is incorrect. Data to be loaded "' + sd + '"');
        }
    }
    catch(e){
        logger.error('Failed to read the tutorial data. Data to be loaded "' + sd + '"');
    }
}

app.get('/api/bgm', (req, res) => {
  res.json(bgm_list);
});

app.get('/api/game', (req, res) => {
  if(req.query.room_id){
    if(game_server[req.query.room_id]){
      res.json(game_server[req.query.room_id]);
    }
    else{
      res.json(false);
    }
  }
  else{
    res.json(game_server);
  }
});

app.get('/api/tutorial', (req, res) => {
  res.json(stage_data);
});

app.get('/api/join', (req, res) => {
  res.json(join_list);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
