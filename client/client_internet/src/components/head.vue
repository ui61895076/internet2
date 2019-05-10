<template>
    <div>
        <div class="container-fluid sjhead">
            <div class="row">
                <div class="col-lg-3">
                    <img src="../assets/images/logo-s.png" class="logo-img">
                </div>
                <div class="col-lg-9">
                    <div class="head-setting">
                        <a ><i class="iconfont icon-duanxin mess"></i>消息</a>
                        <a><i class="iconfont icon-buoumaotubiao06 set"></i> 设置<i class="iconfont icon-xiangxiajiantou xiajiantou"></i></a>
                        <a @click="logOut"><i class="iconfont icon-tuichu"></i> 退出</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods:{
            logOut(){
                localStorage.removeItem('token');//登出删除token
                localStorage.removeItem('user_profil');//登出删除用户信息
                this.$router.push('/login')//登出页面跳转到登录页
            }
        }
    }
</script>

<style lang="less" scoped>
    .sjhead{
        height: 64px;
        background: #0db2ef;
        overflow: hidden;
        img{
            margin-left: 32px;
        }
        .head-setting{
            line-height: 64px;
            font-size: 14px;
            float: right;
            a{
                color:#fff;
                padding: 0 18px;
                position:relative;
                cursor: pointer;
                &:hover{
                    text-decoration-line: none;
                }
            }
        }
    }
    .mess{
        margin-right: 2px;
        vertical-align: middle;
    }
    .set{
        vertical-align: middle;
    }
    .xiajiantou{
        vertical-align: middle;
        margin-left: 2px;
    }

</style>
