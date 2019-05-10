const express= require('express');
const router= express.Router();
const jwt= require("jsonwebtoken");
const request= require('request');
const querystring = require('querystring');
const svgCaptcha= require('svg-captcha');// svg格式的验证码
const connection= require('../config/mysql_connect');
const passport =require('passport');
const menu_data = require('../config/left-menu-stu')


//根据用户角色返回左侧菜单
router.post('/left_menu',passport.authenticate("jwt",{session:false}),(req,res)=>{
    if(req.body.role==='student'){
        res.json({menu_data:menu_data.stu_menu})
    }
    if(req.body.role==='teacher'){
        res.json({menu_data:menu_data.ter_menu})
    }

})


//left-menu-profil 组件下编辑信息

router.post('/edit_userProfile',(req,res)=>{
    let role= req.body.user_info.role==='student'?'students':'teacher'

    let sql= `update ${role} set ? where name='${req.body.user_info.name}' and phoneNum='${req.body.user_info.phoneNum}'`;

    let newCon={name:req.body.post_d.name,phoneNum:req.body.post_d.phoneNum,email:req.body.post_d.email}

    connection.query(sql,newCon,(err,result)=>{
        if (err) throw err;
        res.json({msg:'修改成功',code:1})

    })

})

module.exports=router
