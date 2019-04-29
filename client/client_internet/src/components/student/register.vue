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
                           <el-form-item label="选择学校">
                               <el-cascader
                                       :options="options"
                                       v-model="selectedOptions"
                                       @change="handleChange">
                               </el-cascader>
                           </el-form-item>
                            <el-form-item label="选择班级">
                                <el-cascader
                                        :options="options2"
                                        v-model="selectedOptions2"
                                        @change="handleChange2">
                                </el-cascader>
                            </el-form-item>

                           <el-form-item>
                               <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                               <el-button @click="resetForm('ruleForm')">重置</el-button>
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
            return {
                options:[], //级联菜单
                options2:[], //级联菜单
                selectedOptions:[],//级联菜单的v-model
                selectedOptions2:[],//级联菜单的v-model
                ruleForm: { //表单
                    name: '',
                    schoolName:'',
                    collageName:'',
                    className:'',
                    pwd:'',
                    phoneNum:'',
                    email:''

                },
                rules: {//表单验证
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            this.$axios.get('/api/stu/ser_school_collage').then(res=>{  //请求学校院系api
                this.options=res.data
            })
        },
        methods:{
            submitForm(formName) {//表单提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/stu/register',this.ruleForm).then(res=>{

                        }).catch(err=>{
                            console.log(err)
                           this.$message({
                               message:err.response
                           })
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) { //表单重置按钮
                this.$refs[formName].resetFields();
            },
            handleChange(value) {//级联 选择学校与院系
                let ser_class={schoolName:value[0],collageName:value[1]}  //已经选择的学校与院系
                this.$axios.post('/api/stu/ser-class',ser_class).then(res=>{
                  this.options2=res.data  //通过学校院系筛选出班级
                })
                this.ruleForm.schoolName=value[0]
                this.ruleForm.collageName=value[1]

            },
            handleChange2(value) {//级联 选择对应的班级
                this.ruleForm.className=value[0]
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
        padding: 10px;
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
</style>
