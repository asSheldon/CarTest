var mysql = require('mysql');
var dbconfig = require('./database');
var pool = mysql.createPool(dbconfig.mysql);
//创建连接池
exports.getcar = function(id,callback){
    pool.getConnection(function(err,connection){
        var sql = "SELECT * FROM rentalcar where id = "+id;
        connection.query(sql,function(err,rows){
            if(err){
                console.log("err");
            }
            console.log(rows);
            callback(rows);
        })
    })
}

//订单表
exports.book = function(name,model,type,price,time){
    pool.getConnection(function(err,connection){
        connection.query('INSERT INTO indent SET?',{name:name,model:model,type:type,price:price,time:time},function(err,data){
            if(err){
                console.log("fail");
            }else{
                console.log("订单提交成功");
            }

        })
    })

}

//导出订单
exports.getbook = function(name,callback){
    pool.getConnection(function(err,connection){
        var sql = "SELECT * FROM indent where name = '"+name+"'";
        connection.query(sql,(err,result)=>{
            if(err){
                throw err;
            }
            else{
                console.log(result);
                result = JSON.stringify(result);
                callback(result);
            }
            
        })
    })
}