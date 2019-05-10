import Vue from 'vue'
import App from './App.vue'
import router from './router'
import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'bootstrap/dist/css/bootstrap.css'
import axios from '../http/http'
import store from './store/index'
Vue.config.productionTip = false
Vue.use(elementUi)
Vue.prototype.$axios=axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
