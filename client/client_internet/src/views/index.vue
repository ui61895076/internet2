<template>
    <div class="index_bg">
         <Head></Head>
        <div class="left-menu">
            <left-menu :datas="left_menu_data"></left-menu>
        </div>
        <Dialog :options="opt">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="ruleForm.name" :placeholder="user_profile.name" ></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNum">
                    <el-input v-model="ruleForm.phoneNum" :placeholder="user_profile.phoneNum" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email" :placeholder="user_profile.email" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="submitForm('ruleForm')">修改</el-button>
                </el-form-item>
            </el-form>

        </Dialog>
    </div>
</template>

<script>
    import Head from '../components/head'
    import LeftMenu from '../components/left-menu'
    import Dialog from '../components/dialog'
    export default {
        data(){
            return{
                left_menu_data:[],//右侧导航菜单数据
                opt:{
                    title:'修改个人信息',
                    width:'30%'
                },
                ruleForm: {
                    name:'',
                    phoneNum:'',
                    email:''
                }

            }
        },
        computed:{
            user_profile(){
                return JSON.parse(localStorage.getItem('user_profil'))
            }
        },
       components:{
           Head,
           LeftMenu,
           Dialog
       },
        created(){//获取用户权限，返回左侧菜单
            let role=JSON.parse(localStorage.getItem('user_profil')).role
           this.$axios.post('/index/left_menu',{role}).then(res=>{
              this.left_menu_data=res.data.menu_data;
           })
            this.ruleForm.name=this.user_profile.name;
            this.ruleForm.phoneNum=this.user_profile.phoneNum;
            this.ruleForm.email=this.user_profile.email;
        },
        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.ruleForm)
                        let post_data={user_info:{role:this.user_profile.role,name:this.user_profile.name,phoneNum:this.user_profile.phoneNum},post_d:this.ruleForm}
                        this.$axios.post('/index/edit_userProfile',post_data).then(res=>{
                            this.$message({
                                message:'修改成功',
                                type:'success'
                            });
                            let obj=JSON.parse(localStorage.getItem('user_profil'));
                            obj.name=this.ruleForm.name;
                            obj.phoneNum=this.ruleForm.phoneNum;
                            obj.email=this.ruleForm.email;
                            localStorage.setItem('user_profil',JSON.stringify(obj))
                            this.$router.go(0)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
.index_bg{
    background: #e6e8ed;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.left-menu{
    width: 15%;
    overflow: hidden;
    height: 100%;
    background: #fff;
    box-shadow: 3px 0 6px #ccc ;
    margin-top: 4px;
    margin-left: 4px;
    padding:10px;
}

</style>
