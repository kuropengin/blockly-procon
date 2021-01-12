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
var menuMatchRouter = require('./routes/menu-match');
var matchRouter = require('./routes/match');
var watchingRouter = require('./routes/watching');

var server_data = require('./tool/server_data_load');
var tutorial_data = require('./tool/tutorial_data_load');
var bgm_data = require('./tool/bgm_data_load');
var config_load = require('./tool/config_data_load');

var chaser = require('./chaser/server.js');

var app = express();


//socket.io
app.io = chaser.io;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mode_path = config_load.electron_conf_load();

app.use('/bgm',express.static(path.join(__dirname, mode_path, 'load_data', 'bgm_data')));
app.use('/about/LICENSE',express.static(path.join(__dirname, mode_path, 'LICENSE')));
app.use('/about/TOS',express.static(path.join(__dirname, mode_path, '/TOS')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/menu-programming', menuProgrammingRouter);
app.use('/programming', programmingRouter);
app.use('/menu-tutorial', menuTutorialRouter);
app.use('/tutorial', tutorialRouter);
app.use('/menu-match',menuMatchRouter);
app.use('/match', matchRouter);
app.use('/watching',watchingRouter);



//API

//init load
const bgm_list = bgm_data.load();

const game_server = JSON.parse(JSON.stringify(server_data.load()));
const join_list = server_data.list_load();
const stage_data = JSON.parse(JSON.stringify(tutorial_data.load()));



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
