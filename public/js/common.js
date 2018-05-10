function getCk() {
  const ck = document.cookie;
  const ckArr = ck.split(';');
  let ckObj = {};
  ckArr.forEach(i => {
    let kv = i.split('=');
    ckObj[kv[0]] = kv[1];
  });
  return ckObj;
}