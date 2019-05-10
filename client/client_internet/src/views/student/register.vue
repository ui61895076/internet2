<template>
    <div class="reg_bg">
       <div class="container">
           <div class="row">
               <div class="col-lg-12 login-title-img">
                   <img src="../../assets/images/title-login.png" class="center-block img-responsive">
               </div>
           </div>
           <div class="row">
               <div class="col-lg-12">
                   <div class="reg_box">
                        <h2>学生注册</h2>
                       <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                           <el-form-item label="用户名" prop="name">
                               <el-input v-model="ruleForm.name"></el-input>
                           </el-form-item>
                           <el-form-item label="密码" prop="pwd">
                               <el-input type="password" v-model="ruleForm.pwd" autocomplete="off"></el-input>
                           </el-form-item>
                           <el-form-item label="确认密码" prop="checkPwd">
                               <el-input type="password" v-model="ruleForm.checkPwd" autocomplete="off"></el-input>
                           </el-form-item>
                           <el-form-item label="手机号" prop="phoneNum">
                               <el-input v-model="ruleForm.phoneNum"></el-input>
                           </el-form-item>
                           <el-form-item label="邮箱" prop="email">
                               <el-input v-model="ruleForm.email"></el-input>
                           </el-form-item>
                           <el-form-item label="选择学校" prop="schoolName">
                               <el-cascader
                                       placeholder="请选择学校,院系"
                                       :options="options"
                                       v-model="ruleForm.selectedOptions"
                                       @change="handleChange">
                               </el-cascader>
                           </el-form-item>
                            <el-form-item label="选择班级" prop="className">
                                <el-cascader
                                        placeholder="请选择学校"
                                        :options="options2"
                                        v-model="ruleForm.selectedOptions2"
                                        @change="handleChange2">
                                </el-cascader>
                            </el-form-item>

                           <el-form-item>
                               <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
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
            var validateEmail=(rule,value,callback)=>{ //邮箱验证
                let regEmail=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
                if(value ===''){
                    callback(new Error('邮箱不能为空'))
                } else if (!regEmail.test(value)){
                    callback(new Error('邮箱格式不正确'))
                }else{
                    callback();
                }
            };
            var validateSchoolName=(rule,value,callback)=>{//学校、院系验证
                if(value === ''){
                    callback(new Error('请选择学校、院系'))
                }else {
                    callback()
                }
            };
            var validateClassName=(rule,value,callback)=>{//班级验证
                if(value === ''){
                    console.log(1111)
                    callback(new Error('请选择学校、院系'))
                }else {
                    callback()
                }
            }
            return {
                options:[], //级联菜单
                options2:[], //级联菜单
                ruleForm: { //表单
                    name: '',
                    schoolName:'',
                    collageName:'',
                    className:'',
                    pwd:'',
                    checkPwd:'',
                    phoneNum:'',
                    email:'',
                    selectedOptions:[],//级联菜单的v-model
                    selectedOptions2:[],//级联菜单的v-model

                },
                rules: {//表单验证
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ],
                    pwd: [
                        { validator: validatePass, trigger: 'blur', required: true }
                    ],
                    checkPwd: [
                        { validator: validatePass2, trigger: 'blur', required: true}
                    ],
                    phoneNum: [
                        { validator: validatePhoneNum, trigger: 'blur', required: true}
                    ],
                    email: [
                        { validator: validateEmail, trigger: 'blur', required: true}
                    ],
                    schoolName: [
                        {validator:validateSchoolName, trigger: 'blur', required: true}
                    ],
                    className: [
                        {validator:validateClassName, trigger: 'blur', required: true}
                    ]

                }
            }
        },
        created(){
            this.$axios.get('/stu/ser_school_collage').then(res=>{  //请求学校院系api
                this.options=res.data
            })
        },
        methods:{
            submitForm(formName) {//表单提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/stu/register',this.ruleForm).then(res=>{ //学生注册信息
                             this.$message({
                                 message:'注册成功',
                                 type: 'success'
                             })
                            this.$router.push('/login')
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

            handleChange(value) {//级联 选择学校与院系
                let ser_class={schoolName:value[0],collageName:value[1]}  //已经选择的学校与院系
                this.$axios.post('/stu/ser-class',ser_class).then(res=>{ //选择学校接口
                  this.options2=res.data  //通过学校院系筛选出班级
                })
                this.ruleForm.schoolName=value[0]
                this.ruleForm.collageName=value[1]

            },
            handleChange2(value) {//级联 选择对应的班级
                this.ruleForm.className=value[0]  //选择已经选择的班级
            }
        }
    }
</script>

<style scoped lang="less">
.reg_bg{
    width: 100%;
    height: 100%;
    background: url('../../assets/images/bs.png') no-repeat center;
    overflow: hidden;
}
.login-title-img{
    margin-top: 100px;
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

/deep/ .el-cascader{display:block}
/deep/ .el-button{width:100%}
</style>
