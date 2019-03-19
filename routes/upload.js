var fs = require('fs');
const path = require('path');

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
  var des_file = path.resolve(__dirname, '..') + `/dist/${req.files.file.originalFilename}`;
  fs.readFile(req.files.file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        res.end('error')
      } else {
        response = {
          code: 0,
          message: 'successfully',
          filePath: 'http://localhost/' + req.files.file.originalFilename
        };
        res.end(JSON.stringify(response));
      }
    })
  })
});


module.exports = router;
