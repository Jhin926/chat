var express = require('express');
var router = express.Router();
const url = 'mongodb://127.0.0.1:27017';

let MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');

  const reqBody = req.body;

  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbase = db.db('ymb');
	console.log(dbase);
	return;
    dbase.collection("users").find({"phoneNo": reqBody.phoneNo}).toArray((err, result) => {
      if (err) throw err;
      if (result.length <= 0) {
        res.json({"success": false, "msg": "输入的用户名不存在"});
      } else {
        if (result[0].pwd !== reqBody.pwd) {
          res.json({"success": false, "msg": "密码错误"});
        } else {
          res.json({"success": true});
        }
      }
      db.close();
    });
  });
});

module.exports = router;
