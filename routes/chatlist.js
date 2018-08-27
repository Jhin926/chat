var express = require('express');
var router = express.Router();
// const url = 'mongodb://127.0.0.1:27017';
const url = require('../bin/config').mgdUrl;

let MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function (req, res, next) {
  const reqQuery = req.query;

  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbase = db.db('ymb');

    const addr = reqQuery.addr ? reqQuery.addr : '1';
    const queryKey = reqQuery.key;

    const findParam = {addr};
    if (queryKey) {
      findParam.title = new RegExp(queryKey);
    }

    const sortBy = reqQuery.sortBy;
    dbase.collection("chats").find(findParam).toArray((err, result) => {
      if (err) throw err;
      if (result.length <= 0) {
        if (queryKey) {
          res.json({ "success": false, "msg": "没有符合条件的聊天室，赶紧新建一个吧" });
        } else {
          res.json({ "success": false, "msg": "当前城市还没有聊天室，赶紧新建一个吧" });
        }
      } else {
        if (sortBy === 'hot') {
          result = result.sort((p, n) => reqQuery.sortAsc==='true' ? (n.hot - p.hot) : (p.hot - n.hot));
        } else if (sortBy === 'number') {
          result = result.sort((p, n) => reqQuery.sortAsc==='true' ? (n.hot - p.hot) : (p.hot - n.hot));
        }
        res.json({ "success": true, result});
      }
      db.close();
    });
  });
});

module.exports = router;
