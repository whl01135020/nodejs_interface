var express = require("express");
var app = express();
var query = require("./db");
const mysql = require("mysql");
const querystring = require("querystring");
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
// 连接数据库的配置
var connection = mysql.createConnection({
  // 主机名称，一般是本机
  host: "localhost", // 数据库的端口号，如果不设置，默认是3306 // 创建数据库时设置用户名
  //  port: '3306',
  user: "root", // 创建数据库时设置的密码
  password: "root", // 创建的数据库
  database: "nodeinterface"
});
// 与数据库建立连接
connection.connect();
//根据参数，查询数据
app.get("/index", function(req, res) {
  // 处理 get 请求，获取 get 请求参数
  //处理 /:xxx 形式的 get 或 post 请求，获取请求参数 这里没有使用到
  var params = req.query; //查询语句
  var sql = "select * from node where name= ? and sex=?";
  var where_value = [params.name, params.sex]; // console.log(sql)
  connection.query(sql, where_value, function(err, result) {
    if (err) {
      console.log("[SELECT ERROR]:", err.message);
    }
    res.send(result); //数据库查询结果返回到result中,把查询数据发送到客户端
  });
});
//查询所有数据
app.get("/getDataList", (req, res) => {
  const sqlStr = "select * from node ";
  connection.query(sqlStr, (err, results) => {
    if (err)
      return res.json({
        err_code: 1,
        message: "数据不存在",
        affextedRows: 0
      });
    res.json({
      err_code: 200,
      data: results,
      affextedRows: results.affextedRows
    });
  });
});
// 增加数据
app.post("/add", (req, res) => {
  const user = req.body;
  const addSql = "insert into node(id,name,sex,age) values(0,?,?,?)";
  connection.query(addSql, user, (err, results) => {
    if (err) {
      return res.json({
        code: 1,
        message: "添加失败",
        affextedRows: 0
      });
    }
    res.json({
      code: 200,
      message: "添加成功",
      affextedRows: results.affextedRows
    });
  });
});

app.post("/update", (req, res) => {
  var params = req.body;
  var sql = "update node set name=? , age=?, sex=? where id=?";
  var update_value = [params.name, params.age, params.sex, params.id];
  connection.query(sql, update_value, (err, results) => {
    if (err) {
      return res.json({
        code: 1,
        message: "修改失败",
        affextedRows: 0
      });
    }
    res.json({
      code: 200,
      message: "修改成功",
      affextedRows: results.affextedRows
    });
  });
});

//删除数据
app.post("/delete", (req, res) => {
  var params = req.body.id;
  var sql = "delete from node where id= ?";
  connection.query(sql, params, (err, results) => {
    if (err) {
      return res.json({
        code: 1,
        message: "删除失败",
        affextedRows: 0
      });
    }
    res.json({
      code: 200,
      message: "删除成功",
      affextedRows: results.affextedRows
    });
  });
});

//删除数据
app.post("/search", (req, res) => {
  var params = req.body.name;
  var sql = "select * from node where name= ?";
  connection.query(sql, params, (err, results) => {
    if (err) {
      return res.json({
        code: 1,
        message: "查询失败",
        affextedRows: 0
      });
    }
    // res.json ({
    //     code: 200,
    //     message: '查询成功',
    //     affextedRows:results.affextedRows
    // })
    res.send(results);
  });
});
//关闭连接
//connection.end();
//监听8080端口
var server = app.listen(3001, function() {
  console.log("server running at 3001 port");
  var host = server.address().address;

  var port = server.address().port;
});

/* const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',     // 改成你自己的密码
    database: 'interface'    // 改成你的数据库名称
});
connection.connect();

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
}); */
