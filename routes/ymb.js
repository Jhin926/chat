var express = require('express');
var router = express.Router();
const request = require('request');

// 下面是一个发起ajax请求的栗子
/* let yyy = {};
var options = {
  url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb055edabdbc3e271&redirect_uri=http%3A%2F%2Fwx.weidu.xin&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
  method: "get"
};
request(options, function(err, res, data) {
  yyy = data;
}); */

router.get('/', function (req, res, next) {
  next();
},function (req, res) {
  res.send('ymbymb');
});


// 延时响应接口
router.get('/delay', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');
  setTimeout(() => {
    res.send('delay');
  }, 5000)
});


// 返回json数据
router.get('/rhm', function (req,res) {
  res.json({'00123': 'a'});
});

// 不定参数接口
router.get('/rhm/:id', function(req,res,next){
  if(req.params.id === '0') next('route');
  else next();
},function(req,res){
  res.send('id不是0');
});
router.get('/rhm/:id', function(req,res,next){
  res.send('id是0');
});


// cors跨域
router.post('/test', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');

  res.send('test');
});
router.get('/test', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');

  res.send('test');
});


// jsonp接口
router.get('/jsonp', function (req, res, next) {
  let callback = req.query.jsoncallback;
  
  // 方法1（ 自定义回调函数名字）  
  /* let resStr = callback + '(' + JSON.stringify({ymb: 'ymb'}) + ')';
  res.send(resStr); */
  
  // 方法2（ 自定义回调函数名字）（app.js里面也要设置一下app.set('jsonp callback name', 'jsoncallback');）
  /* res.jsonp({ymb: 'ymb'}); */
  
  // 默认回调函数名字callback
  res.jsonp({ymb: 'ymb'});
});

// 415错误
router.post('/errorparam', function (req, res, next) {
  res.send('xxx');
});

module.exports = router;
