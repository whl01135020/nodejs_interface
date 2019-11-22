var express = require("express");
var app = express();
const router = express.Router();
var bodyParser = require("body-parser");
//引用bodyParser 这个不要忘了写
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//设置跨域访问
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
var questions = [
  {
    name: "小明",
    sex: "男",
    age: 18,
    id: 1
  },
  {
    name: "小红",
    sex: "女",
    age: 14,
    id: 2
  }
];

//写个接口123
app.get("/123", function(req, res) {
  res.status(200), res.json(questions);
});

app.post("/wdltest", function(req, res) {
  console.log(req.stack);
  console.log(req.body);
  console.log(req.url);
  console.log(req.query);
  res.json(req.body);
});

//删除
app.post("/delUser", (req, res) => {
  var _id = req.body.id;
  console.log("id----------", _id);
  res.status(200), res.json(questions.filter(item => item.id == _id));
  //   questions
  //     .remove({ id: id })
  //     .then(data => {
  //       res.send({ err: 0, msg: "del ok", data: null });
  //     })
  //     .catch(err => {
  //       res.send({ err: -1, msg: err._message, data: null });
  //     });
});

//配置服务端口
var server = app.listen(3001, function() {
  var host = server.address().address;

  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
