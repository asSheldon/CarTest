
//get重点在从服务器上获取资源，post重点在向服务器发送数据；
var express = require('express');
var fs = require('fs');
var router = require('./router');
var User = require('./User');
var car = require('./car');
var cart = require('./cart');
var rentalcart = require('./rentalcar');
var bodyParser = require('body-parser') ;//提供body属性
var path = require('path');
var app = express();
var session = require('express-session');
var cookieparser = require('cookie-parser');
var multer = require('multer')
var static = require('express-static')



app.use('/node_modules/', express.static('./node_modules'));
app.use('/assets/', express.static('./assets'));
app.use('/images/',express.static('./images'));
app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views/'));
app.use('assets/commodity/images/roadster', static(__dirname + 'assets/commodity/images/roadster'));
static(path.resolve(__dirname,'assets/commodity/images/roadster'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret:'carwork',
    resave:true,
    cookie:{maxAge:360*1000},
    saveUninitialized:false
}))

//把容器挂载到app服务中
app.use(router); 
app.use(car);
app.use(cart);
app.use(rentalcart);
// app.use(m_car);
// app.use(m_User);
// app.use(User);

app.listen(5000, function () {
    console.log('服务器启动成功，可以通过 http://127.0.0.1:5000/ 进行访问')
})      

module.exports = app;
