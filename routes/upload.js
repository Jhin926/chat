const formidable = require("formidable");

module.exports.upload = function(req, res) {
  console.log(123);
  // parse a file upload
  var form = new formidable.IncomingForm(),
    files = [],
    fields = [],
    docs = [];
  console.log("start upload");

  //存放目录
  // form.uploadDir = "tmp/";

  // form
  //   .on("field", function(field, value) {
  //     //console.log(field, value);
  //     fields.push([field, value]);
  //   })
  //   .on("file", function(field, file) {
  //     console.log(field, file);
  //     files.push([field, file]);
  //     docs.push(file);

  //     var types = file.name.split(".");
  //     var date = new Date();
  //     var ms = Date.parse(date);
  //     fs.renameSync(file.path, "tmp/files" + ms + "_" + file.name);
  //   })
  //   .on("end", function() {
  //     console.log("-> upload done");
  //     res.writeHead(200, {
  //       "content-type": "text/plain"
  //     });
  //     var out = {
  //       Resopnse: {
  //         "result-code": 0,
  //         timeStamp: new Date()
  //       },
  //       files: docs
  //     };
  //     var sout = JSON.stringify(out);
  //     res.end(sout);
  //   });

  form.parse(req, function(err, fields, files) {
    err && console.log("formidabel error : " + err);

    console.log("parsing done");
  });
};
