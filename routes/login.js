var express = require('express');
var router = express.Router();
const url = require('../bin/config').mgdUrl;

let MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.post('/', function(req, res, next) {
  const reqBody = req.body;

  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbase = db.db('ymb');
    dbase.collection("users").find({"phoneNo": reqBody.phoneNo}).toArray((err, result) => {
      if (err) throw err;
      if (result.length <= 0) {
        res.json({"success": false, "msg": "输入的用户名不存在"});
      } else {
        if (result[0].pwd !== reqBody.pwd) {
          res.json({"success": false, "msg": "密码错误"});
        } else {
          req.session.userName = reqBody.phoneNo;
          res.cookie('login', true, {httpOnly: false});
          res.cookie('userName', reqBody.phoneNo, {httpOnly: true});
          res.json({"success": true});
        }
      }
      db.close();
    });
  });
});

module.exports = router;
