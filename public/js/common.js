function getCk() {
  var ck = document.cookie;
  var ckArr = ck.split(';');
  var ckObj = {};
  ckArr.forEach(function (i) {
    var kv = i.split('=');
    ckObj[kv[0]] = kv[1];
  });
  return ckObj;
}

function getSer() {
  var ser = location.search;
  var serArr = ser.split('&');
  var serObj = {};
  serArr.forEach(function(i) {
    var kv = i.split('=');
    serObj[kv[0]] = decodeURI(kv[1]);
  });
  return serObj;
}