import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
// 导入图标样式
import './assets/fonts/iconfont.css'
import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import TreeTable from 'vue-table-with-tree-grid'
Vue.use(ElementUI)

// 配置请求根路径
axios.defaults.baseURL = 'http://liufusong.top:8899/api/private/v1/'

axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
