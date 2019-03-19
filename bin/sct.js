let MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const socket = require("socket.io");


const comFn = require("./common");
const url = require("../config").mgdUrl;

function sct(server) {
  var io = socket(server);

  // 连接socket
  io.on("connection", function(socket) {
    MongoClient.connect(
      url,
      {useNewUrlParser: true},
      (err, db) => {
        if (err) throw err;

        // 查询房间列表
        const dbase = db.db("ymb");
        dbase
          .collection("chats")
          .find()
          .toArray((err, result) => {
            if (err) throw err;

            db.close();
            const ck = socket.request.headers.cookie;
            let userName = comFn.getCk(ck)["userName"];

            if (userName === undefined) {
              const randomNo = ~~(Math.random() * 1000000);
              userName = "游客·" + randomNo;
            }

            let hd = socket.request.headers;
            let roomId = /id=([^&]+)/.exec(hd.referer);
            if (Object.is(roomId, null)) {
              roomId = '5c9097317361813360a8ebb0';
            } else {
              roomId = roomId[1];
            }

            result.forEach(i => {
              if (i._id.toString() === roomId) {
                if(!i.users) {i.users = []}
                if (i.users.indexOf(userName) < 0) {
                  // 用户不在当前聊天室
                  socket.join(roomId, () => {
                    io.to(roomId).emit("sys", {
                      msg: `${userName}进入房间`
                    });
                  });
                  MongoClient.connect(
                    url,
                    {useNewUrlParser: true},
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

            // 客户端发送消息
            socket.on("send msg", function(data) {
              let clientMsg = {userName: userName};
              if (data.msg !== '') {
                clientMsg.msg = data.msg;
              }
              if (data.type === 'img') {
                clientMsg.type = 'img';
                clientMsg.url = data.url;
              }

              // 推送客户端发送的消息
              socket.to(roomId).emit("get msg", clientMsg);
            });

            // 离开房间
            socket.on("disconnect", function() {
              // 推送离开房间消息
              io.to(roomId).emit("sys", {
                msg: `${userName}离开房间`
              });

              // 更新数据库
              MongoClient.connect(
                url,
                {useNewUrlParser: true},
                (err, db) => {
                  if (err) throw err;
                  const dbase = db.db("ymb");
                  dbase
                    .collection("chats")
                    .find({ _id: ObjectID(roomId) })
                    .toArray((err, result) => {
                      if (err) throw err;
                      if (result[0]) {
                        if (result[0].users) {
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

                          // 更新房间人数
                          io.to(roomId).emit("get num", {
                            num: result[0].users.length
                          });
                        }
                      } else {
                        // 更新房间人数
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

module.exports = sct;
