var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var chatlist = require('./routes/chatlist');
var chatadd = require('./routes/chatadd');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser('12345'));
app.use(session({
  secret: '12345',
  resave: true,
  saveUninitialized:true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest: '/tmp/'}).array('image'));

app.use('/', index);
app.use('/api/users', users);
app.use('/api/login', login);
app.use('/api/register', register);
app.use('/api/chatlist', chatlist);
app.use('/api/chatadd', chatadd);

// test sourcetree view

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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