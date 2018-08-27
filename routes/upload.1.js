
var fs = require('fs');


var express = require('express');
var router = express.Router();

router.use('/', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With');
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

var multipart = require('connect-multiparty'); //在处理模块中引入第三方解析模块 
var multipartMiddleware = multipart();

router.post('/', multipartMiddleware, function (req, res, next) {
  var des_file = __dirname + `/${req.files.file.originalFilename}`;
  fs.readFile(req.files.file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        res.end('error')
      } else {
        response = {
          message: 'file uploaded successfully',
          filename: req.files.file.originalaname
        };
        res.end(JSON.stringify(response));
      }
    })
  })
});


module.exports = router;
