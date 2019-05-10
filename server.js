const express = require('express');
const bodyParser= require('body-parser');
const passport = require('passport');
const studentRouter = require('./api/api-student');
const teacherRouter = require('./api/api-teacher');
const adminRouter = require('./api/api-admin');
const indexRouter = require('./api/api-index');
const qiniuRouter = require('./api/qn')
const app= express();
const port= process.env.PORT||3000;
const connection= require('./config/mysql_connect');


//连接mysql
connection.connect((err)=>{
    if(err) throw  err;
    console.log('mysql is sucess');
});


//express 设置允许跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,X-File-Name,authorization");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Cache-Control","no-store");
    if(req.method == 'OPTIONS'){
        res.sendStatus(200).end();
    }else{
        next();
    }
});


//使用passport 初始化
app.use(passport.initialize());
require('./config/passportJwt')(passport);

//body-parser初始化
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//学生api
app.use('/stu',studentRouter);
//教师api
app.use('/ter',teacherRouter);
//管理员api
app.use('/admin',adminRouter);

//首页api
app.use('/index',indexRouter);


//七牛云api
app.use('/qn',qiniuRouter)
app.listen(port,()=>{
    console.log('server 3000 is success!')
});

