var mysql = require('mysql');
var dbconfig = require('./database');
var pool = mysql.createPool(dbconfig.mysql);
//创建连接池

//登录验证
exports.checklogin = function(name,pwd,res,callback){
	pool.getConnection(function(err,connection){
		var sql = "SELECT * FROM user where username='" + name + "' and password='" + pwd + "'";
		connection.query(sql,function(err,rows){
			var ok = 0;
			if(err) {
				return res.status(500).json({
					err_code: 500,
					message: err.message
				})
		   }
		   if(rows.length!=0){
			   ok = 1;
			   callback(ok);
			   res.status(200).json({
				   err_code: 0,
				   message: 'ok'
			   })
		   }else{
			   return res.status(200).json({
				   err_code: 1,
				   message: 'Password is invalid'
			   })
		   }
		})
	})
}
//注册页面
exports.register = function(name,pwd,email,phone,res){
	var username = name;
	var password = pwd;
	var postbox = email;
	var phone = phone;
	pool.getConnection(function(err,connection){
		var sql = "SELECT * FROM user where username='" + username + "' or postbox='" + postbox + "'";
		var ok = 0;
		connection.query(sql,function(err,rows){
			if(err) {
				return res.status(500).json({
					err_code: 500,
					message: err.message
				})
		   }
		   console.log(rows);
		   if(rows.length!=0){
			  return res.status(200).json({
				  err_code: 1,
				  message:'Email or nickname aleady exists.'
			  })
		   }
		   
		   connection.query('INSERT INTO user SET?',{username:username,password:password,postbox:postbox,phone:phone},function(err,data){
				if(err){
					console.log("fail");
				}else{
					res.status(200).json({
						err_code: 0,
						message: 'ok'
					})
					console.log("插入数据成功");
				}
					
		   })

	// 	   connection.query('INSERT INTO userinfo SET?',{name:username},function(err,data){
	// 		if(err){
	// 			console.log("fail");
	// 		}else{
	// 			res.status(200).json({
	// 				err_code: 0,
	// 				message: 'ok'
	// 			})
	// 			console.log("插入个人信息成功");
	// 		}
				
	//    })
		   
		})
	})
}

//修改密码
exports.newpassword = function(name,pwd,res,callback){
	pool.getConnection(function(err,connection){
		var sql = "UPDATE user set password=? WHERE username=?";
		connection.query(sql,[pwd,name],function(err,rows){
			var ok = 0;
			if(err) {
				return res.status(500).json({
					err_code: 500,
					message: err.message
				})
		   }
		   if(rows.length!=0){
			   ok = 1;
			   callback(ok);
			   res.status(200).json({
				   err_code: 0,
				   message: 'ok'
			   })
		   }else{
			   return res.status(200).json({
				   err_code: 1,
				   message: 'Password is invalid'
			   })
		   }
		})
	})
}

//找回密码
exports.searchpwd = function(email,res){
	pool.getConnection(function(err,connection){
		var sql = "SELECT password FROM user where postbox='" + email + "'";
		connection.query(sql,function(err,result){
			var ok = 0;
			console.log(result[0].password)
			if(err) {
				return res.status(500).json({
					err_code: 500,
					message: err.message
				})
		   }
		   if(result){
			   ok = 1;
			   res.status(200).json({
				   err_code: 0,
				   pwd: result[0].password,
				   message: 'ok'
			   })
		   }else{
			   return res.status(200).json({
				   err_code: 1,
				   pwd: 0,
				   message: 'Password is invalid'
			   })
		   }
		})
	})
}

//用户信息
exports.userinfo = function(name,introduce,sex,birth,res){
	pool.getConnection(function(err,connection){
		var sql = "UPDATE userinfo set introduce=?,sex=?,birthday=? WHERE name=?";
		connection.query(sql,[introduce,sex,birth,name],function(err,rows){
			var ok = 0;
			if(err) {
				return res.status(500).json({
					err_code: 500,
					message: err.message
				})
		   }
		   if(rows.length!=0){
			   ok = 1;
			   res.status(200).json({
				   err_code: 0,
				   message: 'ok'
			   })
		   }else{
			   return res.status(200).json({
				   err_code: 1,
				   message: 'Password is invalid'
			   })
		   }
		})
	})
}
