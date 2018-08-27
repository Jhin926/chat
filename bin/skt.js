let MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const socket = require("socket.io");


const comFn = require("./common");
const url = require("./config").mgdUrl;

function skt(server) {
  var io = socket(server);

  io.on("connection", function(socket) {
    MongoClient.connect(
      url,
      (err, db) => {
        if (err) throw err;
        const dbase = db.db("ymb");
        dbase
          .collection("chats")
          .find()
          .toArray((err, result) => {
            if (err) throw err;

            let roomIdList = result.map(i => i._id.toString());
            db.close();
            // 连接socket
            const ck = socket.request.headers.cookie;
            let userName = comFn.getCk(ck)["userName"];

            if (userName === undefined) {
              const randomNo = ~~(Math.random() * 1000000);
              userName = "游客·" + randomNo;
            }

            let hd = socket.request.headers;
            let roomId = /id=([^&]+)/.exec(hd.referer);
            if (Object.is(roomId, null)) {
              roomId = 0;
            } else {
              roomId = roomId[1];
            }

            if (roomIdList.indexOf(roomId) < 0) {
              // 如果这个id不在已有的聊天室列表里
            } else {
              result.forEach(i => {
                if (i._id.toString() === roomId) {
                  if (i.users && i.users.indexOf(userName) < 0) {
                    // 用户不在当前聊天室
                    socket.join(roomId, () => {
                      io.to(roomId).emit("sys", {
                        msg: `${userName}进入房间`
                      });
                    });
                    MongoClient.connect(
                      url,
                      (err, db) => {
                        if (err) throw err;
                        const dbase = db.db("ymb");
                        dbase
                          .collection("chats")
                          .find({ _id: ObjectID(roomId) })
                          .toArray((err, result) => {
                            if (err) throw err;
                            const users = [...result[0].users, userName];
                            dbase
                              .collection("chats")
                              .update(
                                { _id: ObjectID(roomId) },
                                { $set: { users, numbers: users.length } }
                              );

                            io.to(roomId).emit("get num", {
                              num: users.length
                            });
                            db.close();
                          });
                      }
                    );
                  }
                }
              });
            }

            socket.on("send msg", function(data) {
              socket.to(roomId).emit("get msg", {
                msg: data.params,
                userName: userName
              });
            });

            socket.on("disconnect", function() {
              io.to(roomId).emit("sys", {
                msg: `${userName}离开房间`
              });

              MongoClient.connect(
                url,
                (err, db) => {
                  if (err) throw err;
                  const dbase = db.db("ymb");
                  dbase
                    .collection("chats")
                    .find({ _id: ObjectID(roomId) })
                    .toArray((err, result) => {
                      if (err) throw err;
                      console.log(result)
                      if (result[0]) {
                        const userIdx = result[0].users.indexOf(userName);
                        result[0].users.splice(userIdx, 1);
                        dbase
                          .collection("chats")
                          .update(
                            { _id: ObjectID(roomId) },
                            {
                              $set: {
                                users: result[0].users,
                                numbers: result[0].users.length
                              }
                            }
                          );

                        io.to(roomId).emit("get num", {
                          num: result[0].users.length
                        });
                      } else {
                        io.to(roomId).emit("get num", {
                          num: 0
                        });
                      }
                      db.close();
                    });
                }
              );
            });
          });
      }
    );
  });
}

module.exports = skt;
