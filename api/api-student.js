const express= require('express')
const router= express.Router()
const jwt= require("jsonwebtoken")
const request= require('request')
const querystring = require('querystring');
const svgCaptcha= require('svg-captcha')// svg格式的验证码
const captcha = svgCaptcha.create() //创建验证码，返回一个对象text,svg标签
const connection= require('../config/mysql_connect')
const passport =require('passport')

//学生注册
router.post('/register',(req,res)=>{
    let sql ='insert into students set ?'
    let sql2 =`select * from students where name = '${req.body.name}'`
    let con={name:req.body.name,pwd:req.body.pwd,phoneNum:req.body.phoneNum,email:req.body.email}
    connection.query(sql2,(err,result)=>{
        if (err) throw err

       if(result.length!=0){
           res.json({msg:'用户名已存在！'})
       }else {
           connection.query(sql,con,(err,result)=>{
               if (err) throw err
               res.json({msg:'添加成功！',con})
           })
       }
    })

})


// //学生登录
router.post('/login',(req,res)=>{
    let sql = `select * from students where name = '${req.body.name}' and pwd= '${req.body.pwd}'`
        connection.query(sql,(err,result)=>{
            if(err) throw err
           if(result.length==0){
               res.json({msg:'用户名或密码错误！'})
           }else {
               jwt.sign({id:result[0].id,name:result[0].name,phoneNum:result[0].phoneNum},"secret",{expiresIn:7200},(err,token)=>{
                  if(err) throw err
                   res.json ({msg:'登录成功!',token:'bearer '+ token})
              })

           }

        })
})


router.get('/ser_school_collage',(req,res)=>{ //教师注册，学生注册，需要选择对应的学校与院系
    //let sql ='select school_name.schoolName,collage.yx_name,school_name.yx_id from school_name,collage where school_name.yx_id= collage.yx_id'
     let sql =' select t1.schoolName,t1.yx_id,group_concat(t1.yx_name) as yx_name  from (select school_name.schoolName,collage.yx_name,' +
       'collage.yx_id from school_name,collage where school_name.yx_id= collage.yx_id) t1 group by t1.schoolName'
    //let sql='select st.schoolName,st.yx_name, group_concat(st.class_name) class_name from (  select school_name.id,school_name.schoolName,school_name.yx_id,collage.yx_name,class.class_name_id ,class_name from school_name,collage,class  where  school_name.yx_id = collage.yx_id  and  collage.class_name_id= class.class_name_id and school_name.yx_id=class.yx_id ) st group by st.schoolName,st.yx_name'

    var ary=[]
    connection.query(sql,(err,result)=>{

          result.forEach(item=>{
              var obj ={}
             obj.label=item.schoolName
              obj.children=[]
              if(item.yx_name){
                  ary_yx_name=item.yx_name.split(',')
                  for(var i=0;i<ary_yx_name.length;i++){
                      let obj2={}
                      obj2.label=ary_yx_name[i]
                      obj.children.push(obj2)
                  }
              }
             ary.push(obj)
          })


        res.json(ary)
    })
})

router.post('/ser-class',(req,res)=>{//教师注册，学生注册，根据学校，院系选择对应的班级
    let sql= ' select class_name from (select schoolName,yx_name,class_name from collage,class,school_name where collage.yx_id=school_name.yx_id  and collage.class_name_id=class.class_name_id and class.yx_id = school_name.yx_id) t where t.schoolName="南京师范大学" and t.yx_name ="计算机系"'
    connection.query(sql,(err,result)=>{
        res.json(result)
    })
})


var verifyvt=null
//聚合数据api 短信验证码
router.post('/phoneSend',(req,res)=>{
     verifyvt= require('../config/captcha')()//随机验证码
    console.log(verifyvt)
    var queryData = querystring.stringify({
        "mobile": "13951034314",  // 接受短信的用户手机号码
        "tpl_id": "147270",  // 您申请的短信模板ID，根据实际情况修改
        "tpl_value": "#code#=123456",  // 您设置的模板变量，根据实际情况修改
        "key": "bd78d3403e63668b0108dc617ed0ff4a",  // 应用APPKEY(应用详细页查询)
    });
    var queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // 打印接口返回内容

            var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
            res.json(jsonObj)

        } else {
            console.log('请求异常');
        }
    })
})


//忘记密码
var filterUser_name=null
router.post('/filterUser',(req,res)=>{
    let sql=`select * from students where name='${req.body.name}'`
    connection.query(sql,(err,result)=>{
        if(err) throw err
        if(result.length==0){
            res.json({msg:'用户名并不存在！'})
        }else{
            //前台隐藏的 验证码 发送样式 显示出来

            filterUser_name=result[0].name
            console.log(result[0].name,filterUser_name)
            res.json({code:1})
        }
    })

})

//验证码验证
router.post('/vft',(req,res)=>{
    if(req.body.vft.toUpperCase()==verifyvt.toUpperCase()){
        //显示修改密码的样式，或者弹框
        res.json({code:1,msg:'验证码正确'})
    }else {
        res.json({msg:'验证码错误！'})
    }
})

//重置密码
router.post('/restpwd',(req,res)=>{
   // console.log(filterUser_name)
    let sql2 =`update students set ? where name= '${filterUser_name}'` //需要更新的用户的信息
    let newName={name:req.body.name}
    connection.query(sql2,newName,(err,result)=>{
        if(err) throw err
        res.json({msg:'修改成功'})
        filterUser_name=null
    })
})



module.exports=router
