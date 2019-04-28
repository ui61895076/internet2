const express = require('express')
const bodyParser= require('body-parser')
const passport = require('passport')
const mysql= require('mysql')
const studentRouter = require('./api/api-student')
const teacherRouter = require('./api/api-teacher')
const app= express()
const port= process.env.PORT||3000
const connection= require('./config/mysql_connect')


//连接mysql1
connection.connect((err)=>{
    if(err) throw  err
    console.log('mysql is sucess')
});





//使用passport 初始化
app.use(passport.initialize())
require('./config/passportJwt')(passport)

//body-parser初始化
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//学生api
app.use('/stu',studentRouter)

app.use('/ter',teacherRouter)

app.listen(port,()=>{
    console.log('server 3000 is success!')
})

