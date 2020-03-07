// Express 提供了一个专门用来包装路由的方法
var express = require('express');
var async = require('async');

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
var userrows;

//获取购物车信息
router.post('/getcart',function (req,res) {
    var result = [];
	var sql = "select * from cart";
    var username = req.body.username;
    sql = sql + " where username=" + "'" + username + "'";
	pool.getConnection(function(err, connection){
  		connection.query(sql, function(err, rows){
  			if(err) {
   				throw err;
  			}else{
                if (err) throw err;
                async.map(rows, function(item, callback) {
                    sql = "select * from car where model=?";
                    connection.query(sql, item.model, function(err, car){
                        Object.assign(item, car[0]);
                        callback(null, item);
                     });
                }, function(err,results) {
                    res.send(results);
                });
  			}
 		});
 		connection.release();
	});
});

//车的数量减少
router.post('/subCarCount',function (req,res) {
	var result = [];
	var username = req.body.username;
	var model = req.body.model;
	var count = req.body.count;
	if(count > 1){
		var sql = "update cart set quantity=";
		sql = sql + (--count);
		sql = sql + " where username=" + "'" + username + "'" + "and model=" + "'" + model + "'";
		console.log(sql);
		pool.getConnection(function(err, connection){
  			connection.query(sql, function(err, rows){
  				if(err) {
   					throw err;
  				}else{
                	res.send({msg: "true"});
  				}
			});
			connection.release();
		});
	}
});


//车的数量增加
router.post('/addCarCount',function (req,res) {
	var result = [];
	var username = req.body.username;
	var model = req.body.model;
	var count = req.body.count;
	var sql = "update cart set quantity=";
	sql = sql + (++count);
	sql = sql + " where username=" + "'" + username + "'" + "and model=" + "'" + model + "'";
	console.log(sql);
	pool.getConnection(function(err, connection){
  		connection.query(sql, function(err, rows){
  			if(err) {
   				throw err;
  			}else{
				console.log("pass");
                res.send({msg: "true"});
  			}
 		});
 		connection.release();
	});
});

//删除车
router.post('/delCar',function (req,res) {
	var result = [];
	var username = req.body.username;
	var model = req.body.model;
	var sql = "delete from cart";
	sql = sql + " where username=" + "'" + username + "'" + "and model=" + "'" + model + "'";
	pool.getConnection(function(err, connection){
  		connection.query(sql, function(err, rows){
  			if(err) {
   				throw err;
  			}else{
                res.send({msg: "true"});
  			}
 		});
 		connection.release();
	});
});

module.exports = router;