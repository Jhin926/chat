function getCk(ck) {
  console.log(ck);
  if (!ck) {
    retrun ;
  }
  var ckArr = ck.split(';');
  var ckObj = {};
  ckArr.forEach(function (i) {
    var kv = i.split('=');
    ckObj[kv[0].replace(/ /g, '')] = kv[1].replace(/ /g, '');
  });
  return ckObj;
}

module.exports = {getCk}