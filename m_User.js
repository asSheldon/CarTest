var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'carwork'
});

connection.connect();
module.exports = {
    checklogin : function(name,pwd,res,callback){
        
        var sql = "select * from admin where username = '" + name + "' and password = '" + pwd + "'";
        
        connection.query(sql,function (err, result){
            var ok = 0;
            if(err){
                return res.status(500).json({
                    err_code:500,
                    message:err.message
                })
            }
            console.log(result);
            if(result.length!=0){
                ok = 1;
                callback(ok);
                res.status(200).json({
                    err_code:0,
                    message:'ok'
                })
            }else{
                return res.status(200).json({
                    err_code:1,
                    message:'用户名密码无效'    
                })
            }
            
		});
    }
}
