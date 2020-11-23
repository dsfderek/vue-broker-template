// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import regComponents from '@common/reg-components'
import filter from '@common/filter/index.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.scss'
// import '@/assets/iconfont/iconfont.css'

require('@common/permission')


require('@common/validator-rule') //todo按需
require('@common/directive')
Vue.use(ElementUI, { size: 'mini' })
Vue.use(regComponents)
// 过滤器
for (let key in filter) {
  Vue.filter(key, filter[key]);
}


import websocket from '@/common/websocket'

Vue.prototype.$websocket = websocket;


// const path = require('path');
// const files = require.context('@/modules', true, /services.js$/);
// var allApi = {};
// files.keys().forEach(key => {
//   const name = path.basename(key, '.vue');
//   allApi = Object.assign(allApi,(files(key).default || files(key)));
// })

// Vue.prototype.$api = allApi

//mock
// if(process.env.NODE_ENV !== 'production') {
//   const mock = require('../mock')
//   mock.mockXHR()
// }

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: function (createElement) {
    if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
      window.addEventListener('hashchange', () => {
        var currentPath = window.location.hash.slice(1)
        if (this.$route.path !== currentPath) {
          this.$router.push(currentPath)
        }
      }, false)
    }
    return createElement(App);
  }
})

