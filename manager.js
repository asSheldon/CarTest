var mysql = require('mysql');
var dbconfig = require('./database');
var pool = mysql.createPool(dbconfig.mysql);
//创建连接池
exports.getuser = function(callback){
    pool.getConnection(function(err,connection){
        var sql = "SELECT username FROM user";
        connection.query(sql,function(err,result){
            if(err){
                console.log("err");
            }
            else{
                // console.log(result);
                result = JSON.stringify(result);
                callback(result);
            }
        })
    })
}
exports.deluser = function(name){
    pool.getConnection(function(err,connection){
        var sql = "DELETE FROM user WHERE username = '"+name+"'";
        connection.query(sql,function(err,result){
            if(err){
                console.log("err");
            }
            else{
               console.log('删除成功');
            }
        })
    })
}
exports.gethirecar = function(callback){
    pool.getConnection(function(err,connection){
        var sql = "SELECT * FROM rentalcar";
        connection.query(sql,function(err,result){
            if(err){
                console.log("err");
            }
            else{
                // console.log(result);
                result = JSON.stringify(result);
                callback(result);
            }
        })
    })
}

exports.delcar = function(id){
    pool.getConnection(function(err,connection){
        var sql = "DELETE FROM rentalcar WHERE id = '"+id+"'";
        connection.query(sql,function(err,result){
            if(err){
                console.log("err");
            }
            else{
               console.log('删除成功');
            }
        })
    })
}

exports.Updatecars = function(model,type,price,id){
    pool.getConnection(function(err,connection){
        var sql = "update rentalcar set model = ? , type = ? ,price = ? where id ="+id;
        var params = [model,type,price];
        connection.query(sql,params,function(err,result){
            if(err){
                console.log("err");
            }
            else{
               console.log('修改成功');
            }
        })
    })
}

exports.addhirecar = function(model,type,price,person,url,id){
    pool.getConnection(function(err,connection){
        var sql = 'insert into rentalcar(model,type,price,person,url,id) values(?,?,?,?,?,?)';
        var params = [model,type,price,person,url,id];
        connection.query(sql,params,function(err,result){
            if(err){
                console.log("err");
            }
            else{
               console.log('添加租车成功');
            }
        })
    })
}