import axios from 'axios'
import { Loading,Message } from 'element-ui'
import router from '../../../../../../vuePro/client/client/src/router'
//加载动画


let loading
function startLoading () {
    loading=Loading.service({
        lock:true,
        text:'拼命加载中...',
        background:'rgba(0,0,0,0.5)'
    })
}

function endLoading(){
    loading.close()
}


//请求拦截
axios.interceptors.request.use(config=>{
    startLoading()
    const token=localStorage.getItem('loginToken')
    if(token){
        config.headers.Authorization=token
    }
    return config
},error => {
    endLoading()
    return Promise.reject(error)
})

//响应拦截
axios.interceptors.response.use(res=>{
    endLoading()
    return res
},error => {
    endLoading()
    const {status}=error.response
    if(status==401){
        Message({
            message: 'token已经过期！',
            type: 'warning'
        });
        localStorage.removeItem('loginToken')
        router.push('/login')
    }
    return Promise.reject(error)
})


export default axios