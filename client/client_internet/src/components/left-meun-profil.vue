<template>
    <div class="user_profile">
        <p class="user_avatar">
            <img src="../assets/images/user-avatar.jpg" />
        </p>
        <p v-if="user_profil.name" class="user_style">姓名：{{user_profil.name}}</p>
        <p v-if="user_profil.schoolName" class="user_style">学校：{{user_profil.schoolName}}</p>
        <p v-if="user_profil.collageName" class="user_style">院系：{{user_profil.collageName}}</p>
        <p v-if="user_profil.className" class="user_style">班级：{{user_profil.className}}</p>
        <p class="edit_profile" @click="edit_dialog">编辑信息</p>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        data(){
            return {
                user_profil:{}
            }
        },
        mounted(){
            let user_p=JSON.parse(localStorage.getItem('user_profil'));
            this.user_profil=user_p;

        },
        methods:{
            ...mapActions(['editDialogUser']),
            edit_dialog(){
                this.editDialogUser()
            }
        }
    }
</script>

<style lang="less" scoped>
.user_profile{
    width: 100%;
    background: #fff;
    overflow: hidden;
}
.user_avatar{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin: 20px auto;
    box-shadow: 0 0 5px #ccc;
    img{
        width: 100px;
        height: 100px;

    }
}
.edit_profile{
    width: 100%;
    height: 30px;
    color: #fff;
    text-align: center;
    line-height: 30px;
    background: #dd587d;
    cursor: pointer;
}
.user_style{
    color: #9d9d9d;
}
    p{
        margin-bottom: 6px !important;
    }
</style>
