var io = require('socket.io')(server);

// 连接socket
let roomInfo = {};
io.on('connection', function (socket) {
  const ck = socket.request.headers.cookie;
  let userName = comFn.getCk(ck)['userName'];

  if (userName===undefined) {
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

  if (roomInfo[roomId] === undefined) {
    roomInfo[roomId] = [userName];
  } else {
    if (roomInfo[roomId].indexOf(userName) < 0) {
      socket.join(roomId, () => {
        io.to(roomId).emit('sys', {
          msg: `${userName}进入房间`
        });
      });
      roomInfo[roomId].push(userName);
    }
  }

  socket.on('send msg', function (data) {
    socket.to(roomId).emit('get msg', {
      msg: data.params,
      userName: userName
    });
  });

  socket.on('disconnect', function(){
    io.to(roomId).emit('sys', {
      msg: `${userName}离开房间`
    });

    const userIdx = roomInfo[roomId].indexOf(userName);
    roomInfo[roomId].splice(userIdx, 1);
  });
});

module.exports