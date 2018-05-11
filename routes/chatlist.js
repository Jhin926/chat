var express = require('express');
var router = express.Router();
const url = 'mongodb://127.0.0.1:27017';

let MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function (req, res, next) {
  const reqQuery = req.query;

  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbase = db.db('ymb');
    const addr = reqQuery.addr ? reqQuery.addr : '1';
    dbase.collection("chats").find({ "addr": addr }).toArray((err, result) => {
      if (err) throw err;
      if (result.length <= 0) {
        res.json({ "success": false, "msg": "当前城市还没有聊天室，赶紧新建一个吧" });
      } else {
        res.json({ "success": true, result});
      }
      db.close();
    });
  });
});

module.exports = router;
