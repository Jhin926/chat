function getCk(ck) {
  console.log(ck);
  var ckArr = ck.split(';');
  var ckObj = {};
  ckArr.forEach(function (i) {
    var kv = i.split('=');
    ckObj[kv[0]] = kv[1];
  });
  return ckObj;
}

module.exports = {getCk}