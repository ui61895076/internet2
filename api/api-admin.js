const express= require('express');
const router= express.Router();
const jwt= require("jsonwebtoken");
const request= require('request');
const querystring = require('querystring');
const svgCaptcha= require('svg-captcha') ;// svg格式的验证码
const connection= require('../config/mysql_connect');
const passport =require('passport');


//通过管理员学校信息获取院系
router.post('/sel_collage',(req,res)=>{
    let sql=`select collage.id,collage.yx_id,collage.yx_name,collage.class_name_id from collage,(select * from school_name where schoolName='${req.body.schoolName}') school where school.yx_id= collage.yx_id`;
    connection.query(sql,(err,result)=>{
        if (err) throw err;
        res.json(result);
    })
})


//通过院系选择班级
router.post('/sel_class',(req,res)=>{
    let sql=`select id,class_name from class where yx_id='${req.body.yx_id}' && class_name_id='${req.body.class_name_id}'`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        if(result.length===0){
            res.status(403).json({msg:'找不到对应的班级！'});
        }
        else{
            res.json(result);
        }
    })
});

//通过学校院系选择教师
router.post('/sel_teacher',(req,res)=>{
    let sql=`select id,name,phoneNum,email from teacher where schoolName='${req.body.schoolName}' and collageName='${req.body.collageName}'`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        if(result.length===0){
            res.status(403).json({msg:'找不到对应的教师！'});
        }else{
            res.json(result);
        }
    })
});

//通过院系信息选择课程名
router.post('/sel_course',(req,res)=>{
    let sql=`select * from course where yx_id='${req.body.yx_id}' and class_name_id='${req.body.class_name_id}'`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        if(result.length===0){
            res.status(403).json({msg:'找不到对应的课程！'});
        }else{
            res.json(result);
        }
    })
});

//管理员添加课程信息（学校管理员） 需要token验证
router.post('/add_course',(req,res)=>{
   let sql='insert into add_course set ?';
    let addCourse={schoolName:req.body.schoolName,collageName:req.body.collageName,className:req.body.className,teacherName:req.body.teacherName,courseName:req.body.courseName,startTime:req.body.startTime,endTime:req.body.endTime,remarks:req.body.remarks};
    connection.query(sql,addCourse,(err,result)=>{
        if(err) throw err;
        res.json({msg:'课程添加成功！'});
    })
});


module.exports=router;
