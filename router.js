var fs = require('fs');
// Express 提供了一个专门用来包装路由的方法
var express = require('express');
var User = require('./User');
var m_User= require('./m_User');
var m_car= require('./m_car');
var zcar = require('./zcar');
var manager = require('./manager');
var url = require('url');
//创建一个路由容器
var router = express.Router();
//设置session
var session = require('express-session');
var cookieparser = require('cookie-parser');
var formidable = require('formidable');
var multiparty =require('multiparty');

//访问首页
router.get('/', function (req, res) {
    res.render('./Next/Home.html',{
        user : req.session.username
    });
});
//登录页面
router.get('/login',function (req,res) {
    res.render('Login.html');
});
//商品页
router.get('/services',function (req,res) {
    res.render('Services.html',{
        user: req.session.username
    });
});
router.post('/login',function(req,res){
    var name = req.body.username;
    var pwd = req.body.password;
    // console.log(name+" "+pwd);
    User.checklogin(name,pwd,res,data=>{
        if(data === 1)
        {
            req.session.username = name;
            req.session.password = pwd;
            console.log(req.session.username+" "+req.session.password);
        }
    })
});
router.get('/register',function (req,res) {
    res.render('Register.html');
});
//注册账号录入
router.post('/register',function(req,res){
    var name = req.body.nickname;
    var em = req.body.email;
    var tel = req.body.phone;
    var pwd = req.body.password;
    console.log(tel);
    User.register(name,pwd,em,tel,res);
});

router.get('/Home',function(req,res){
    res.render('./Next/Home.html',{
        user: req.session.username
    });
});
//用户个人主页
router.get('/setting/admin',function(req,res){
    // console.log(req.session.password)
    res.render('./Set/admin.html',{
        user: req.session.username,
        pwd : req.session.password

    })
});

//修改密码
router.post('/update',function(req,res){
    var name = req.session.username;
    var pwd = req.body.newpwd;
    User.newpassword(name,pwd,res,data=>{
        if(data === 1){
            console.log("修改成功");
        }
    })
});

//上传头像
router.get('/setting/profile',function(req,res){
    res.render('./Set/profile.html',{
        user: req.session.username,
        pwd : req.session.password
    })
})

//找回密码页面
router.get('/search',function(req,res){
    res.render('Searchpwd.html');
});
//找回密码功能
router.post('/search',function(req,res){
    var email = req.body.email;
    User.searchpwd(email,res);
});

//购物车页面
router.get('/shopping',function(req,res){
    res.render('./Next/shoppingcar.html')
});

//用户信息保存
router.post('/userinfo',function(req,res){
    var name = req.session.username;
    var sex;
    if(req.body.inlineRadioOptions === 'option1')
    {
        sex = '男'
    }else if(req.body.inlineRadioOptions === 'option2')
    {
        sex = '女'
    }else{
        sex = '保密'
    }
    var ins = req.body.ins;
    var bir = req.body.bir;
    console.log(name+sex+ins+bir);
    User.userinfo(name,ins,sex,bir,res);

})

//我的订单页
router.get('/myident',function(req,res){
    res.render('./Next/Myorder.html',{
        user : req.session.username
    });
});

//租车
router.get('/CarRental',function(req,res){
    res.render('./taxi/taxi.html',{
        user: req.session.username
    });
});

//租车详细页
router.get('/CarRental/detail',function(req,res){
    var arg = url.parse(req.url,true).query;
    var id  = arg.id;
    var car;
    console.log(id);
    zcar.getcar(id,data=>{
        car = {"model": data[0].model,"type":data[0].type,"price":data[0].price,"url":data[0].url,"person":data[0].person}
        // console.log(data[0].model);
        res.render('./taxi/single-taxi.html',{
            user: req.session.username,
            car: car
        })
    })
    // console.log(car);
 
})

//提交租车
router.get('/booktaxi',function(req,res){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    if(minute<10){
        minute = "0"+minute;
    }
    var second = date.getSeconds();
    if(second<10)
    {
        second = "0"+second;
    }
    console.log(year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second);
    var time = year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second;
    var arg = url.parse(req.url,true).query;
    var model  = arg.model;
    var type = arg.type;
    var price = arg.price;
    var name = req.session.username;
    console.log(name+model+type+price);
    zcar.book(name,model,type,price,time);
    res.redirect('/CarRental');
})

//获取租车信息
router.post('/getbook',function(req,res){
    var name = req.session.username;
    console.log(name);
    zcar.getbook(name,data=>{
        res.send(data);
    })
})


//用户退出
router.get('/out',function(req,res){
    req.session.username = null;
    res.redirect('/Home')
});



/*  管理员端  */
//登录
router.get('/manager/login',function(req,res){
    res.render("./manager/lo_gin.html");
 });
 //检验登录
 router.post('/manager/login',function(req,res){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    console.log(year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second);
    var time = {"year":year,"month":month,"day":day,"hour":hour,"minute":minute,"second":second};
    var name = req.body.username;
    var pwd = req.body.password;
    // console.log(name+" "+pwd);
    m_User.checklogin(name,pwd,res,data=>{
        if(data === 1)
        {
            req.session.time = time;
            req.session.m_username = name;
            req.session.m_password = pwd;
            console.log(req.session.m_username+" "+req.session.m_password);
        }
    })
});

// //主页
router.get('/manager/person',function(req,res){
    res.render("./manager/person.html",{
        user : req.session.m_username,
        pwd : req.session.m_password,
        time : req.session.time
    });
    
    if(req.session.m_username != null){
       return;
    }else{
       return res.send("<script>alert('您还没有登录，请先登录！');</script>");
    }
 })

 router.get('/manager/addcar',function(req,res){

    res.render("./manager/addcar.html",{
        user : req.session.m_username,
        pwd : req.session.m_password,
        time : req.session.time
    });
 })

//  //查询数据
 router.get('/manager/getcars', function (req, res) {
    m_car.Searchcars(data=>{
     console.log(data);
     res.end(data);
 })
 
});
router.get('/manager/sales',function(req,res){
 res.render("./manager/sales.html",{
     user : req.session.m_username,
     pwd : req.session.m_password
 });
})
router.get('/manager/clicks',function(req,res){
 res.render("./manager/clicks.html",{
     user : req.session.m_username,
     pwd : req.session.m_password
 });
});
// //添加车辆页面
router.get('/manager/addcaredit',function(req,res){
 res.render("./manager/addcaredit.html")
});

router.post('/addcars',(req,res)=>{ 
     var form = new multiparty.Form(); 
     form.uploadDir='assets/commodity/images/roadster'
      //上传图片保存的地址(目录必须存在) 
     form.parse(req, function(err, fields, files) {
     // 1、fields:获取表单的数据 2、files：图片上传成功返回的信息 
     console.log(fields);
     console.log(files);
     var id = fields.CarId[0];
     var model = fields.Carmodel[0];
     var color = fields.Carcolor[0];
     var name= fields.CarName[0];
     var tatus= fields.Carstatus[0];
     var price = fields.CarPrice[0];
     var src="../"+files.CarPic[0].path;
     m_car.Addcars(id,tatus,model,color,name,price,src,res);
     res.redirect('/manager/addcar');
}); 
})
// //更新数据页面
router.get('/manager/editcar',function(req,res){
 res.render("./manager/editcar.html")
});
// //更新数据功能
 //更新数据功能
 router.post('/manager/editcars',function(req,res){
    var arg = url.parse(req.url,true).query;
    var id  = arg.id;
    var form = new multiparty.Form(); 
    form.uploadDir='assets/commodity/images/roadster'
     //上传图片保存的地址(目录必须存在) 
    form.parse(req, function(err, fields, files) {
    // 1、fields:获取表单的数据 2、files：图片上传成功返回的信息 
    console.log(fields);
    console.log(files);
    var name= fields.CarName[0];
    var model= fields.Carmodel[0];
    var color= fields.Carcolor[0];
    var price = fields.CarPrice[0];
    var src=files.CarPic[0].path;
    m_car.Updatecars(model,color,name,price,src,id,res);
    res.redirect('/manager/addcar');
}); 
});
// //删除数据
router.get('/manager/deletecars',function(req, res){
 var arg = url.parse(req.url,true).query;
 var id  = arg.id;
 m_car.Deletecars(id)
 res.redirect('/manager/addcar')
});
// //用户退出
router.get( "/manager/out", function( req, res ){
//  req.session.destroy(); //销毁session，退出登录
 res.redirect("/manager/login");
});
//用户管理界面
router.get('/manager/user',function(req,res){
    res.render("./manager/user.html",{
        user:req.session.m_username
    })
   });

//获得租车车辆
router.get('/manager/gethirecar',function(req,res){
    manager.gethirecar(data=>{
        res.end(data);
    })
})
//租车服务界面
router.get('/manager/hirecar',function(req,res){
    res.render("./manager/hirecar.html",{
        user:req.session.m_username
    })
   });

//租车服务添加汽车界面
router.get('/manager/addhirecar',function(req,res){
    res.render("./manager/addhirecar.html")
   });

//租车添加车功能
router.post('/manager/hireaddcars',function(req,res){
    var form = new multiparty.Form(); 
    form.uploadDir='assets/Car Rental-images/pricing'
     //上传图片保存的地址(目录必须存在) 
    form.parse(req, function(err, fields, files) {
    // 1、fields:获取表单的数据 2、files：图片上传成功返回的信息 
    console.log(fields);
    console.log(files);
    var id = fields.CarId[0];
    var person = fields.CarSum[0];
    var type = fields.CarType[0];
    var name= fields.CarName[0];
    var price = fields.CarPrice[0];
    var src="../"+files.CarPic[0].path;
    manager.addhirecar(name,type,price,person,src,id);
    res.redirect('/manager/hirecar');
}); 
})   
//租车服务编辑汽车界面
router.get('/manager/edithirecar',function(req,res){
    var arg = url.parse(req.url,true).query;
    var id  = arg.id;
    var model = arg.model;
    var price = arg.price;
    var type = arg.type;
    res.render("./manager/edithirecar.html",{
        id : id ,
        model :model,
        price : price,
        type : type
    })
   });
//编辑租车车辆   
router.post('/manager/edithirecars',function(req,res){
    var model = req.body.CarName;
    var type = req.body.Carmodel;
    var id  = req.body.CarId;
    var price = req.body.CarPrice;
    console.log(model+type+id+price)
    manager.Updatecars(model,type,price,id);
    res.redirect('/manager/hirecar');
})   
//删除租车车辆
router.get('/manager/delhirecar',function(req,res){
    var arg = url.parse(req.url,true).query;
    var id  = arg.id;
    manager.delcar(id);
    res.redirect('/manager/hirecar');
})   

//获取用户
router.post('/usertable',function(req,res){
    manager.getuser(data=>{
        console.log(data);
        res.send(data);
    })
})
//删除用户
router.get('/manager/deluser',function(req,res){
    var arg = url.parse(req.url,true).query;
    var name  = arg.name;
    manager.deluser(name);
    res.redirect('/manager/user');
})
//把Router 导出
module.exports = router;




