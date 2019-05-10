import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
const router = new Router({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      {
          path:'/',
          redirect:'/login'
      },
      {
          path:'/index',
          component:resolve => require(['./views/index.vue'],resolve)
      },
      {
          path:'/register-stu',
          component:resolve => require(['./views/student/register.vue'],resolve) //学生注册
      },
      {
          path:'/register-ter',
          component:resolve => require(['./views/teacher/register.vue'],resolve) //教师注册
      },
      {
          path:'/login',
          component:resolve => require(['./views/login.vue'],resolve) //教师，学生登录
      },
      {
          path:'/findpwd',
          component:resolve => require(['./views/findpwd.vue'],resolve) //找回密码
      },
      {
          path:'/resetPwd',
          component:resolve => require(['./views/resetPwd.vue'],resolve) //找回密码
      },
      {
          path:'/up',
          component:resolve => require(['./components/uploadImage.vue'],resolve) //找回密码
      }

  ]

})

router.beforeEach((to,from,next)=>{ //路由守卫 判断是否已经登录，登录后才能访问其他路由
    let isToken = localStorage.getItem('token')? true : false //获取登录后存在localStorage的token ,没有表示未登录
    if(to.path==='/login'||to.path==='/register-stu'||to.path==='register-ter'||to.path==='findpwd'||to.path==='resetPwd'){
        next()
    }else{
        if(isToken){
            next()
        }else{
            next('/login')
        }
    }
})

export default router
