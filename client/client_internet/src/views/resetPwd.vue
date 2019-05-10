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
                        <h2>重置密码</h2>
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="新密码" prop="pwd">
                                <el-input type="password" v-model="ruleForm.pwd" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="checkPwd">
                                <el-input type="password" v-model="ruleForm.checkPwd" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" @click="submitForm('ruleForm')">修改密码</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name:'resetPwd',
        data(){
            var validatePass = (rule, value, callback) => { //密码验证
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {//两次密码不一致
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {



                ruleForm: { //表单
                    pwd:'',
                    checkPwd:'',
                },
                rules: {//表单验证
                    pwd: [
                        { validator: validatePass, trigger: 'blur'}
                    ],
                    checkPwd: [
                        { validator: validatePass2, trigger: 'blur'}
                    ]


                }
            }
        },
        methods:{
            submitForm(formName) {//表单提交
                this.$refs[formName].validate((valid) => {
                    if (valid){
                        this.$axios.post('/stu/restpwd',{pwd:this.ruleForm.pwd}).then(res=>{
                           this.$message({
                               message:res.data.msg,
                               type:'success'
                           })
                            this.$router.push('/login')
                        })
                    }
                });
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
