const express= require('express');
const router= express.Router();
const jwt= require("jsonwebtoken");
const request= require('request');
const querystring = require('querystring');
const svgCaptcha= require('svg-captcha');// svg格式的验证码
const connection= require('../config/mysql_connect');
const passport =require('passport');

//学生注册
router.post('/register',(req,res)=>{
    let sql ='insert into students set ?';
    let sql2 =`select * from students where name = '${req.body.name}' and phoneNum ='${req.body.phoneNum}'`;
    let con={name:req.body.name,pwd:req.body.pwd,phoneNum:req.body.phoneNum,email:req.body.email,schoolName:req.body.schoolName,collageName:req.body.collageName,className:req.body.className};
    connection.query(sql2,(err,result)=>{
        if (err) throw err
       if(result.length!==0){
           res.status(403).json({msg:'用户名已存在！'});
       }else {
           connection.query(sql,con,(err,result)=>{
               if (err) throw err;
               res.json({msg:'添加成功',con:{name:req.body.name,phoneNum:req.body.phoneNum,email:req.body.email,schoolName:req.body.schoolName,collageName:req.body.collageName,className:req.body.className}});
           })
       }
    })

})

var captcha_login_g=''; //登录时后台验证码验证
router.get('/captcha',(req,res)=>{
    const captcha = svgCaptcha.create(); //创建验证码，返回一个对象text,svg标签
    captcha_login_g=captcha.text;
    res.type('svg');
     res.status(200).send(captcha.data);
})

// //学生，教师登录
router.post('/login',(req,res)=>{
    let sql = `select * from (( (select name,pwd,phoneNum,email,role,schoolName,collageName,className from students)  union all (select name,pwd,phoneNum,email,role,schoolName,collageName,className from teacher) union all (select name,pwd,phoneNum,email,role,schoolName,collageName,className from admin) ) st) where name = '${req.body.name}' and phoneNum ='${req.body.phoneNum}' and pwd ='${req.body.pwd}'`;
        connection.query(sql,(err,result)=>{
            if(err) throw err;
            if(req.body.capt.toLowerCase()!==captcha_login_g.toLowerCase()){//验证码判断
                res.status(403).json({msg:'验证码错误'});
            }else{
                if(result.length==0){
                    res.status(403).json({msg:'用户名或密码错误！'});
                }else {

                    jwt.sign({id:result[0].id,name:result[0].name,phoneNum:result[0].phoneNum},"secret",{expiresIn:7200},(err,token)=>{
                        if(err) throw err;
                        let user_role=result[0].role;
                        if(user_role==='student'){
                            res.json ({msg:'登录成功!',token:'bearer '+ token,result:{name:result[0].name,schoolName:result[0].schoolName,collageName:result[0].collageName,className:result[0].className,phoneNum:result[0].phoneNum,role:result[0].role,email:result[0].email}});
                        }
                        if(user_role=='teacher'){
                            res.json ({msg:'登录成功!',token:'bearer '+ token,result:{name:result[0].name,schoolName:result[0].schoolName,collageName:result[0].collageName,phoneNum:result[0].phoneNum,role:result[0].role,email:result[0].email}})
                        }
                        if(user_role==='admin'){
                            res.json ({msg:'登录成功!',token:'bearer '+ token,result:{name:result[0].name,schoolName:result[0].schoolName,phoneNum:result[0].phoneNum,role:result[0].role,email:result[0].email}})
                        }
                    })
                }
            }
        })
})


router.get('/ser_school_collage',(req,res)=>{ //教师注册，学生注册，需要选择对应的学校与院系
     let sql =' select t1.schoolName,t1.yx_id,group_concat(t1.yx_name) as yx_name  from (select school_name.schoolName,collage.yx_name,' +
       'collage.yx_id from school_name,collage where school_name.yx_id= collage.yx_id) t1 group by t1.schoolName';
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
             ary.push(obj);
          })
        res.json(ary);
    })
})

router.post('/ser-class',(req,res)=>{//教师注册，学生注册，根据学校，院系选择对应的班级
    let ary=[];
    let sql= `select class_name from (select schoolName,yx_name,class_name from collage,class,school_name where collage.yx_id=school_name.yx_id  and collage.class_name_id=class.class_name_id and class.yx_id = school_name.yx_id) t where t.schoolName="${req.body.schoolName}" and t.yx_name = "${req.body.collageName}"`;
    connection.query(sql,(err,result)=>{
        for(var i=0;i<result.length;i++){
            var obj={};
            obj.value=result[i].class_name;
            obj.label=result[i].class_name;
            ary.push(obj);
        }
        res.json(ary) //返回element-ui 级联菜单数据格式
    })
});


var verifyvt=null;
//聚合数据api 短信验证码
router.post('/phoneSend',(req,res)=>{
     verifyvt= require('../config/captcha')()//随机验证码
     var queryData = querystring.stringify({
        "mobile": req.body.phoneNum,  // 接受短信的用户手机号码
        "tpl_id": "155574",  // 您申请的短信模板ID，根据实际情况修改
        "tpl_value": "#code#="+verifyvt,  // 您设置的模板变量，根据实际情况修改
        "key": "bd78d3403e63668b0108dc617ed0ff4a",  // 应用APPKEY(应用详细页查询)
    });
    var queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
            res.json(jsonObj);
        } else {
            console.log('请求异常');
        }
    })
});


//忘记密码
var filterUser_name=null;
router.post('/filterUser',(req,res)=>{
    let sql = `select * from (( (select * from students)  union all (select * from teacher) ) st) where phoneNum ='${req.body.phoneNum}'`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        if(result.length===0){
            res.status(403).json({msg:'您输入的手机号不存在！'});
        }else{
            filterUser_name=result[0].phoneNum;
            res.json({code:1});
        }
    })
});

//验证码验证
router.post('/vft',(req,res)=>{
    if(req.body.phone_vft.toUpperCase()===verifyvt.toUpperCase()){
        //显示修改密码的样式，或者弹框
        res.json({code:1,msg:'验证码正确'})
    }else{
        res.status(403).json({msg:'验证码已过期！'})
    }
});

//captcha验证码
router.post('/nextCaptcha',(req,res)=>{
    if(req.body.capt.toLowerCase()===captcha_login_g.toLowerCase()){
        res.json({code:true});
    }else{
        res.status(403).json({msg:'验证码错误！'});
    }
});

//重置密码
router.post('/restpwd',(req,res)=>{
    let sql=`select * from students where phoneNum = '${filterUser_name}'`;
    let newPwd={pwd:req.body.pwd};
    connection.query(sql,(err,result)=>{
        let tig = result.length!==0?"student":"teacher";
        let sql3 =`update ${tig} set ? where phoneNum= '${filterUser_name}'`;
        connection.query(sql3,newPwd,(err,result)=>{
            if(err) throw err;
            res.json({msg:'修改成功'});
            filterUser_name=null;
        })
    })

})



module.exports=router
