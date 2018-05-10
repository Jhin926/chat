var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cors = require('cors');

express().use(cookieParser());
express().use(session({
  secret: '12345',
  name: 'test',
  cookie: {maxAge:80000},
  saveUninitialized: true
}));

const url = 'mongodb://127.0.0.1:27017';

let MongoClient = require('mongodb').MongoClient;

router.get('/', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://192.168.8.77:8086');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');

  const reqBody = req.body;
  console.log(req.session);
  res.send('yyy');
});

router.post('/', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://192.168.8.77:8086');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');

  const reqBody = req.body;
  console.log(req.headers.cookie);
  res.send('yyy');
  // req.cookie.ymb = 1;
  /*if (req.cookie.ymb) {
    req.cookie.ymb++;
  } else {
    req.cookie.ymb = 1;
  }*/

  /*MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbase = db.db('ymb');
    dbase.collection("users").insertOne(reqBody, (err, res) => {
      if (err) throw err;
      console.log('创建成功');
      res.json({"success": true});
      db.close();
	  });
  });*/
});

module.exports = router;
