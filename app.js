// 1. 一些必须要引用的文件
const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// 2. 设置跨域访问
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 3.连接数据库的配置
var connection = mysql.createConnection({
  host: "localhost", // 创建数据库时设置用户名
  //  port: '3306', // 数据库的端口号，如果不设置，默认是3306
  user: "root", // 创建数据库时设置的密码
  password: "root", // 创建的数据库
  database: "nodeinterface" // 数据库名
});

// 4.与数据库建立连接
connection.connect();

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
  const params = req.body;
  const addSql = "insert into node(name,age,sex) values(?,?,?)";
  const add_value = [params.name, params.age, params.sex];
  connection.query(addSql, add_value, (err, results) => {
    if (err) {
      console.log("err", err);
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

// 修改数据
app.post("/update", (req, res) => {
  const params = req.body;
  const sql = "update node set name=? , age=?, sex=? where id=?";
  const update_value = [params.name, params.age, params.sex, params.id];
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
  const params = req.body.id;
  const sql = "delete from node where id= ?";
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

//根据条件查询数据
app.post("/search", (req, res) => {
  const params = req.body.name;
  let searchSql = params
    ? "select * from node where name= ?"
    : "select * from node ";
  connection.query(searchSql, params, (err, results) => {
    if (err) {
      return res.json({
        code: 1,
        message: "查询失败",
        affextedRows: 0
      });
    }
    res.send(results);
  });
});
//关闭连接
//connection.end();
//监听3001端口
const server = app.listen(3001, function() {
  console.log("server running at 3001 port");
  const host = server.address().address;
  const port = server.address().port;
});
