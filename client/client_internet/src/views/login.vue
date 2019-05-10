<template>
    <div class="reg_bg">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 login-title-img">
                    <img src="../assets/images/title-login.png" class="center-block img-responsive">
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="reg_box">
                        <h2>用户登录</h2>
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="用户名" prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="pwd">
                                <el-input type="password" v-model="ruleForm.pwd" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号" prop="phoneNum">
                                <el-input v-model="ruleForm.phoneNum"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码" prop="capt">
                                <el-input v-model="ruleForm.capt" class="capt-style"></el-input>
                               <img :src="imgsrc" @click="changeCaptcha" class="captImg">
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                            </el-form-item>
                        </el-form>
                        <router-link to="/register-stu" class="span_a">立即注册</router-link>
                        <router-link to="/findpwd" class="span_b" >忘记密码</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'login',
        data(){
            var validateName = (rule, value, callback) => { //密码验证
                if (value === '') {
                    callback(new Error('请输入用户名'));
                } else {

                    callback();
                }
            };
            var validatePass = (rule, value, callback) => { //密码验证
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {

                    callback();
                }
            };


            var validatePhoneNum=(rule,value,callback)=>{ //手机号验证
                let reg = /^1\d{10}$/   //手机号验证
                if(value===''){
                    callback(new Error('手机号不能为空'))
                }else if(!reg.test(value)){
                    callback(new Error('请输入正确的手机号'))
                }else {
                    callback();
                }
            };
            var validateCapt = (rule, value, callback) => { //密码验证
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else {

                    callback();
                }
            };
            return {
                options:[], //级联菜单
                options2:[], //级联菜单
                randomNum:0,
                imgsrc:'http://localhost:3000/stu/captcha',
                ruleForm: { //表单
                    name: '',
                    pwd:'',
                    phoneNum:'',
                    selectedOptions:[],//级联菜单的v-model
                    capt:''


                },
                rules: {//表单验证
                    name: [
                        { validator: validateName, trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ],
                    pwd: [
                        { validator: validatePass, trigger: 'blur',}
                    ],

                    phoneNum: [
                        { validator: validatePhoneNum, trigger: 'blur'}
                    ],
                    capt: [
                        { validator: validateCapt, trigger: 'blur'}
                    ]


                }
            }
        },
        methods:{
            submitForm(formName) {//表单提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/stu/login',this.ruleForm).then(res=>{ //学生、教师登录接口
                            this.$message({
                                message:'登录成功',
                                type: 'success'
                            })
                            localStorage.setItem('token',res.data.token); //将token 存储在localStorage中
                            let s_user_profil=JSON.stringify(res.data.result);//将对象格式转成json字符串
                            localStorage.setItem('user_profil',s_user_profil); //将token 存储在localStorage中
                            this.$router.push('/index');
                            this.changeCaptcha();
                        }).catch(err=>{
                            console.log(err)
                            this.$message({ //注册失败提示
                                message:err.response.data.msg,
                                type: 'warning'
                            })
                        })
                    } else { //表单前端 输入验证
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            changeCaptcha(){//change验证码
                this.randomNum=Math.random()
                this.imgsrc='http://localhost:3000/stu/captcha?n='+this.randomNum
            }

        }
    }
</script>

<style scoped lang="less">
    .reg_bg{
        width: 100%;
        height: 100%;
        background: url('../assets/images/bs.png') no-repeat center;
        overflow: hidden;
    }
    .login-title-img{
        margin-top: 180px;
    }
    .captImg{
        cursor: pointer;
    }
    .reg_box{
        width: 600px;
        padding: 20px;
        margin: 0 auto;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 0 6px #999;
        h2{
            height: 30px;
            font-size: 16px;
            border-bottom: 1px solid #0db2ef;
            color:#0db2ef;
            text-align: left;
            margin-bottom: 15px;
        }
    }
    .span_a{
        color:#ccc;
        margin-left:436px;
    }
    .span_b{
        color:#ccc;
        margin-left: 10px;
    }
    .capt-style{
        width: 67% !important;
    }
    /deep/ .el-cascader{display:block}
    /deep/ .el-button{width:100%}
</style>
