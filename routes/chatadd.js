var express = require('express');
var router = express.Router();
var cors = require('cors');

const url = 'mongodb://127.0.0.1:27017';

let MongoClient = require('mongodb').MongoClient;

router.get('/', function(req, res, next) {
  req.session.user = 'yemubing';
  res.render('index', {
    title: 'the test for nodejs session' ,
    name:'12345'
  });
  res.send('ggg');
});

router.post('/', function(req, res, next) {
  const reqBody = req.body;
  console.log('20::::'+req.session.user);
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
