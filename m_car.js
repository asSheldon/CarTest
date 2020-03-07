var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'carwork'
});

connection.connect();
module.exports = {
    Addcars : function(id,tatus,model,color,name,price,src,res){
        var addsql = 'insert into car(id,status,model,color,brand,price,url) values(?,?,?,?,?,?,?)';
        var params = [id,tatus,model,color,name,price,src];
        connection.query(addsql,params,function (err, result){
            if(err) {
				return res.status(500).json({
					err_code: 500,
					message: err.message
				})
		   }else{
            result = JSON.stringify(result);
            res.end(result);
            console.log("插入数据成功");
        }
        });
    },
    Searchcars : function(callback){
        var sql = 'SELECT * FROM car';
        connection.query(sql,function (err, result){
            if(err){
                return res.status(500).json({
					err_code: 500,
					message: err.message
				})
            }else{
                result = JSON.stringify(result);
                callback(result)
                console.log("查询数据成功");
            }

        });
    },
    Updatecars : function(model,color,name,price,src,id,res){
        var sql = 'update car set brand = ? , price = ? ,url = ? ,model=?,color=? where id =?';
        var params = [name,price,src,model,color,id];
        connection.query(sql,params,function (err, result){
            if(err){
                return res.status(500).json({
					err_code: 500,
					message: err.message
				})
            }else{
                result = JSON.stringify(result);
                res.end(result);
                console.log("修改数据成功");
            }
        });
    },
    Deletecars : function(id){
        var sql = 'delete from car where id =?';
        connection.query(sql,id,function (err, result){
            if(err){
                console.log("删除数据失败");
            }else{
                console.log("删除数据成功");
            }
        });
    }
    
}
