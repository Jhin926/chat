var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var request = require('request');

// 连接数据库
/* var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database : 'ymb'
});
connection.connect();
// 查询数据库
connection.query('SELECT id from city', function(err, rows, fields){
  if(err) throw err;
  console.log('the xx is:', rows[0]);
}); */
// 添加数据
/* let addSql = 'INSERT INTO country(Code, Name, Continent, Region, SurfaceArea, IndepYear, Population, LifeExpectancy, GNP, GNPOld, LocalName, GovernmentForm, HeadOfState, Capital, Code2) VALUES ("YMB","yemubing","Asia",?,?,?,?,?,?,?,?,?,?,?,?)';
let addSqlParam = [1,1,1,1,1,1,1,1,1,1,1,1];
connection.query(addSql, addSqlParam, function(err, rows, fields){
  if(err) throw err;
  console.log('success');
}); */
// 断开数据库连接
// connection.end();


var index = require('./routes/index');
var users = require('./routes/users');
var ymb = require('./routes/ymb');
var upload = require('./routes/upload');

var app = express();
// app.set('jsonp callback name', 'jsoncallback');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest: '/tmp/'}).array('image'));

app.use('/', index);
app.use('/users', users);
app.use('/ymb', ymb);
app.use('/upload', upload);
app.get('/index.html', function(req, res) {
  res.sendFile('index.html');
});


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