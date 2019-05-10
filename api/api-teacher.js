const express= require('express')
const router= express.Router()
const jwt= require("jsonwebtoken")
const request= require('request')
const querystring = require('querystring');
const svgCaptcha= require('svg-captcha')// svg格式的验证码
const captcha = svgCaptcha.create() //创建验证码，返回一个对象text,svg标签
const connection= require('../config/mysql_connect')
const passport =require('passport')

//教师注册
router.post('/register',(req,res)=>{
    let sql ='insert into teacher set ?'
    let sql2 =`select * from teacher where name = '${req.body.name}' and phoneNum ='${req.body.phoneNum}'`
    let con={name:req.body.name,pwd:req.body.pwd,phoneNum:req.body.phoneNum,email:req.body.email,schoolName:req.body.schoolName,collageName:req.body.collageName}
    connection.query(sql2,(err,result)=>{
        if (err) throw err

       if(result.length!==0){
           res.status(403).json({msg:'用户名已存在！'})
       }else {
           connection.query(sql,con,(err,result)=>{
               if (err) throw err
               res.json({msg:'添加成功！',con})
           })
       }
    })

})




router.get('/ser_school_collage',(req,res)=>{ //教师注册，学生注册，需要选择对应的学校与院系
     let sql =' select t1.schoolName,t1.yx_id,group_concat(t1.yx_name) as yx_name  from (select school_name.schoolName,collage.yx_name,' +
       'collage.yx_id from school_name,collage where school_name.yx_id= collage.yx_id) t1 group by t1.schoolName'
    var ary=[];
    connection.query(sql,(err,result)=>{
          result.forEach(item=>{
              var obj ={};
             obj.label=item.schoolName;
              obj.value=item.schoolName;
              obj.children=[];
              if(item.yx_name){
                  ary_yx_name=item.yx_name.split(',');
                  for(var i=0;i<ary_yx_name.length;i++){
                      let obj2={};
                      obj2.label=ary_yx_name[i];
                      obj2.value=ary_yx_name[i];
                      obj.children.push(obj2);
                  }
              }
             ary.push(obj)
          });

        res.json(ary)
    })
});

router.post('/ser-class',(req,res)=>{//教师注册，学生注册，根据学校，院系选择对应的班级
    let sql= ' select class_name from (select schoolName,yx_name,class_name from collage,class,school_name where collage.yx_id=school_name.yx_id  and collage.class_name_id=class.class_name_id and class.yx_id = school_name.yx_id) t where t.schoolName="南京师范大学" and t.yx_name ="计算机系"';
    connection.query(sql,(err,result)=>{
        res.json(result);
    })
});





module.exports=router
