let MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID; 

const socket = require('socket.io');
const comFn = require('../routes/common');

const url = require('../routes/config').mgdUrl;

function skt(server) {
  var io = socket(server);

  io.on('connection', function (socket) {
    MongoClient.connect(url, (err, db) => {
      if (err) throw err;
      const dbase = db.db('ymb');
      dbase.collection("chats").find().toArray((err, result) => {
        if (err) throw err;

        // console.log(result);

        let roomIdList = result.map(i => i._id.toString());
        db.close();
        // 连接socket
        let roomInfo = {};
        const ck = socket.request.headers.cookie;
        let userName = comFn.getCk(ck)['userName'];

        if (userName === undefined) {
          const randomNo = ~~(Math.random() * 1000000);
          userName = '游客·' + randomNo;
        }

        let hd = socket.request.headers;
        let roomId = /id=([^&]+)/.exec(hd.referer);
        if (Object.is(roomId, null)) {
          roomId = 0;
        } else {
          roomId = roomId[1];
        }

        if (roomIdList.indexOf(roomId) < 0) { // 如果这个id不在已有的聊天室列表里
          // roomInfo[roomId] = [userName];
        } else {
          result.forEach(i => {
            if (i._id.toString() === roomId) {
              if (i.users.indexOf(userName) < 0) {
                socket.join(roomId, () => {
                  io.to(roomId).emit('sys', {
                    msg: `${userName}进入房间`
                  });
                });
                // roomInfo[roomId].push(userName);
                MongoClient.connect(url, (err, db) => {
                  if (err) throw err;
                  const dbase = db.db('ymb');
                  dbase.collection("chats").find({"_id": ObjectID(roomId)}).toArray((err, result) => {
                    if (err) throw err;
                    console.log(result);
                  });
                })
              }
            }
          });
        }

        socket.on('send msg', function (data) {
          socket.to(roomId).emit('get msg', {
            msg: data.params,
            userName: userName
          });
        });

        socket.on('disconnect', function () {
          io.to(roomId).emit('sys', {
            msg: `${userName}离开房间`
          });

          // const userIdx = roomInfo[roomId].indexOf(userName);
          // roomInfo[roomId].splice(userIdx, 1);
        });
      });
    });
  });
}

module.exports = skt;