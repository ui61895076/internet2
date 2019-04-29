import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from '../http/http'
Vue.config.productionTip = false
Vue.use(elementUi)
Vue.prototype.$axios=axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
