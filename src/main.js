import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/antd'
import './style/index.less'
import './style/iconfont.less'
import { Scroll } from '@/directive/index.js'

Vue.config.productionTip = false

Vue.use(Scroll)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
