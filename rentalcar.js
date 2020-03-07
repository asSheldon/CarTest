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
router.post('/getRentalCar',function (req,res) {
	var sql = "select * from rentalcar";
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


module.exports = router;