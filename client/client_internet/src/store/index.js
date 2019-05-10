import vue from 'vue'
import vuex from 'vuex'
import * as types from './types'
vue.use(vuex);


const state={
    index_l_dialog:false  //首页编辑信息弹框状态 true显示，false隐藏
};
const getters={};
const mutations={
    [types.EDIT_DIALOG_FLAG](state){ //首页编辑信息弹框状态 true显示，false隐藏
        state.index_l_dialog=!state.index_l_dialog;
    }
}
const actions={
    editDialogUser({commit}){//首页编辑信息弹框状态 true显示，false隐藏
        commit(types.EDIT_DIALOG_FLAG)
    }
}
const store= new vuex.Store({
    state,
    getters,
    mutations,
    actions
})

export default store