<template>
    <div>
        <el-dialog
                :title="options.title"
                :visible.sync="index_l_dialog"
                :width="options.width"
                :before-close="editDialogUser"
                >
            <slot></slot>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex'
    export default {
        props:['options'],
        data(){
            return {

            }
        },
        computed:{
            ...mapState(['index_l_dialog']) //首页编辑信息弹框状态 true显示，false隐藏
        },
        methods:{
            ...mapActions(['editDialogUser'])
        }

    }
</script>

<style>


</style>
