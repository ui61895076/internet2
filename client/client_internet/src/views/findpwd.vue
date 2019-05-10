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
                        <h2>找回密码</h2>
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="手机号" prop="phoneNum">
                                <el-input v-model="ruleForm.phoneNum" @blur="filterPhone"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码" prop="capt">
                                <el-input v-model="ruleForm.capt" class="capt-style"></el-input>
                               <img :src="imgsrc" @click="changeCaptcha" class="captImg">
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" @click="submitForm('ruleForm')">下一步</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
                title="短信验证"
                :visible.sync="isDialog"
                width="30%"
                center>
            <div class="w100">
                <el-input class="capt-style" placeholder="请输入手机验证码" v-model="phone_vft"></el-input>

                <div v-if="isShow" class="captImg2">{{times}}s后重新获取</div>
                <div v-else="isShow" class="captImg2" @click="getPhone_vft"><i class="el-icon-message"></i>获取短信验证码</div>
            </div>


        <el-button type="danger" @click='valiBtn'>提交认证</el-button>

        </el-dialog>
    </div>

</template>

<script>
    export default {
        name:'findpwd',
        data(){

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
                imgsrc:'http://localhost:3000/stu/captcha',
                isPhone:0,//手机号是否存在
                phoneNum:null,
                isDialog:false,//弹出框
                times:120, //短信验证倒计时
                timer:null,//定时器
                isShow:false,//验证码，倒计时切换
                phone_vft:'',
                ruleForm: { //表单
                    phoneNum:'',
                    capt:''
                },
                rules: {//表单验证
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
                    if (valid&&this.isPhone==1) {
                       this.$axios.post('/stu/nextCaptcha',{capt:this.ruleForm.capt}).then(res=>{
                           this.isDialog = res.data.code
                           this.phoneNum=this.ruleForm.phoneNum
                           localStorage.setItem('resetPhoneNum',this.phoneNum)
                       }).catch(err=>{
                           this.$message({
                               message:'验证码错误！',
                               type:'warning'
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
            },

            filterPhone(){ //判断手机号是否存在

                this.$axios.post('/stu/filterUser',{phoneNum:this.ruleForm.phoneNum}).then(res=>{
                    this.isPhone=res.data.code //code:1存在
                }).catch(err=>{
                    this.$message({
                        message:err.response.data.msg,
                        type:'warning'
                    })
                })
            },
            autoTimes(){
                this.times-=1;
                if(this.times<=0){
                    this.times=10
                    this.isShow=false
                    clearInterval(this.timer)
                }
            },
            countdown(){
                this.timer=setInterval(this.autoTimes,1000)

            },
            getPhone_vft(){
                this.isShow=true
                this.countdown()
                this.$axios.post('/stu/phoneSend',{phoneNum:this.phoneNum}).then(res=>{
                })
            },
            valiBtn(){
                this.$axios.post('/stu/vft',{phone_vft:this.phone_vft}).then(res=>{
                    this.isDialog=false
                    this.$router.push('/resetPwd')
                }).catch(err=>{
                    this.$message({
                        message:'短信验证码错误！',
                        type:'warning'
                    })
                })
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
    .captImg2{
        width: 35%;
        float:right;
        line-height: 38px;
        border:1px solid #DCDFE6;
        text-align: center;
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
        width: 60% !important;
        float:left;
    }

    .w100{
        width: 100%;
        overflow: hidden;
        margin-bottom: 30px;
    }
    /deep/ .el-cascader{display:block}
    /deep/ .el-button{width:100%}
</style>
