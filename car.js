// Express 提供了一个专门用来包装路由的方法
var express = require('express');

//创建一个路由容器
var router = express.Router();
//创建连接池
var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'carwork'
});
//车的信息获取
router.post('/getCar',function (req,res) {
	var sql = "select * from Car";
	var brand = eval(req.body.brand);
	var brandlength = req.body.brandlength;
	var color = eval(req.body.color);
	var colorlength = req.body.colorlength;
	for(var i = 0;i < brandlength;i++){
		if(i == 0){
			sql = sql + " where brand=" + "'" + brand[i] + "'"; 
		}else{
			sql = sql + " or brand=" + "'" + brand[i] + "'";
		}
	}
	for(var i = 0;i < colorlength;i++){
		if(i == 0 && brandlength == 0){
			sql = sql + " where color=" + "'" + color[i] + "'"; 
		}else{
			sql = sql + " or color=" + "'" + color[i] + "'";
		}
	}
	pool.getConnection(function(err, connection){
  		connection.query(sql, function(err, rows){
  			if(err) {
   				throw err;
  			}else{
   				if (rows.length != 0) {
					res.send(rows);
   				}else{
   					res.send({msg: "false"});
   				}
  			}
 		});
 		connection.release();
	});
});

//车的信息获取
router.post('/FindCar',function (req,res) {
	var condition = req.body.condition;
	var sql = "select * from Car where model like " + "'%" + condition + "%'" + " or brand like " + "'%" + condition + "%'";
	pool.getConnection(function(err, connection){
  		connection.query(sql, function(err, rows){
  			if(err) {
   				throw err;
  			}else{
   				if (rows.length != 0) {
					res.send(rows);
   				}else{
   					res.send({msg: "false"});
   				}
  			}
 		});
 		connection.release();
	});
});

//添加到购物车
router.post('/addCar',function (req,res) {
	var username = req.body.username;
	var model = req.body.model;
	var quantity = req.body.quantity;
	var time = req.body.time;
	var param = [];
	param.push(time + "_" + username);
	param.push(username);
	param.push(model);
	param.push(quantity);
	var sql = "insert into cart(id, username, model, quantity) values(?, ?, ?, ?)";
	pool.getConnection(function(err, connection){
		connection.query(sql, param,function(err, rows){
			if(err) {
				 throw err;
			}else{
				if (rows.affectedRows != 0) {
				  	res.send({msg: "true"});
				}else{
					res.send({msg: "false"});
				}
			}
	   });
	   connection.release();
  });
});
//购物车检查
router.post('/checkCar',function (req,res) {
	var username = req.body.username;
	var model = req.body.model;
	var param = [];
	param.push(username);
	param.push(model);
	var sql = "select * from cart where username= ? and model = ?";
	pool.getConnection(function(err, connection){
		connection.query(sql, param,function(err, rows){
			if(err) {
				 throw err;
			}else{
				if (rows.length == 0) {
				  	res.send({msg: "true"});
				}else{
					res.send({msg: "false"});
				}
			}
	   });
	   connection.release();
  });
});

module.exports = router;