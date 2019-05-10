<template>
    <div class="side_bar">
        <LeftMenuProfile></LeftMenuProfile>
        <el-menu
                default-active="2"
                class="el-menu-vertical-demo "
                background-color="#fff"
                text-color="#0db2ef"
                active-text-color="#0db2ef">
            <template v-for ='item in datas'>
                <el-menu-item v-if="!item.children">
                    <span>{{item.label}}</span>
                </el-menu-item>
                <el-submenu v-else>
                    <template slot="title">
                        <span>{{item.label}}</span>
                    </template>

                    <left-menu :datas="item.children"></left-menu>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import LeftMenuProfile from '../components/left-meun-profil'
    export default {
        name:'left-menu',
        props:['datas'],
        components:{
            LeftMenuProfile
        }

    }

</script>

<style lang="less" scoped>
.side_bar{
    width:100%;
    height: 100%;

}
/deep/ .el-menu-item:hover{
    color:#fff !important;
    background: #0db2ef !important;
}

/deep/ .el-submenu__title:hover{
    color:#fff !important;
    background: #0db2ef !important;
}
/deep/ .el-menu{
    border-right:none;
}
</style>
