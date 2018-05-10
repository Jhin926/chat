var express = require('express');
var router = express.Router();
var cors = require('cors');

const url = 'mongodb://127.0.0.1:27017';

let MongoClient = require('mongodb').MongoClient;

router.post('/', function (req, res, next) {
  const reqBody = req.body;
  console.log(reqBody);
  const usrName = req.session.userName;
  if (usrName !== undefined) {
    MongoClient.connect(url, (err, db) => {
      if (err) throw err;
      const dbase = db.db('ymb');
      dbase.collection("chats").insertOne(reqBody, (err) => {
        if (err) throw err;
        res.json({ success: true});
        db.close();
      });
    });
  } else {
    res.json({ success: false, msg: '请先登录' });
  }
});

module.exports = router;
