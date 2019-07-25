import Vue from 'vue';
import App from './App';
import router from './router/index';
import axios from 'axios';
import ElementUI from 'element-ui';
import VCharts from 'v-charts';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
//import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import store from './store'
import echarts from 'echarts'
import './assets/icon/iconfont.css'
import has from './directive/permission.js';// 权限判断指令
import { clearValidate,resetForm } from "@/utils/config";
import Blob from './excel/Blob.js'
import Export2Excel from './excel/Export2Excel.js'
import animated from 'animate.css'
import '../static/css/my.css'
import '../static/font/iconfont.css';



// import '../static/ueditor/ueditor.config.js'
// import '../static/ueditor/ueditor.all.js'
import '../static/ueditor/lang/zh-cn/zh-cn.js'
import '../static/ueditor/ueditor.parse.min.js'

import NavHeader from '@/components/common/NavHeader.vue'
Vue.component('nav-header', NavHeader)


Vue.prototype.$clearValidate = clearValidate
Vue.prototype.$resetForm = resetForm
Vue.prototype.$echarts = echarts
Vue.prototype.$host = config.Host;
Vue.prototype.$company = config.company;

Vue.use(VCharts)
Vue.use(ElementUI, { size: 'small' });
Vue.use(animated)
Vue.prototype.$axios = axios;

const whiteList = ['/login']// no redirect whitelist



Vue.filter('datas', function (value) {
    if (!value) return ''
    let dates = new Date(value);
      let y = dates.getFullYear()
      let m = dates.getMonth() + 1;
      let d = dates.getDate();
      let s = dates.getHours();
      let f = dates.getMinutes();
      let ms = dates.getSeconds()
      return y + '-' + (m < 10 ? "0" + m : m) + '-' + (d < 10 ? "0" + d : d) + ' ' + (s < 10 ? "0" + s : s) +':'+(f < 10 ? "0" + f : f) +':' + (ms < 10 ? "0" + ms : ms)
  //	+ ':' + f +':' + m;
  })

  Vue.filter('nowhour', function (value) {
    if (!value) return ''
    let dates = new Date(value);     
      let s = dates.getHours();
      let f = dates.getMinutes();
      return (s < 10 ? "0" + s : s) +':'+(f < 10 ? "0" + f : f) 
  //	+ ':' + f +':' + m;
  })

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    /* 无token */
    if (!store.state.user.token) {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
          } else {
            next('/login') // 否则全部重定向到登录页
          }
    } else {
        if (store.state.user.permissionList.length == 0) {
        //  设置路由  
            store.dispatch('FetchPermission').then(() => {
                console.log(to.path)
               next({ path: to.path })
            })
        }
        else {        
            if (to.path !== '/login') {
                next()
            } else {
                next(from.fullPath)
            }
        }
    }
})


router.afterEach((to, from, next) => {
    store.commit('SET_CURRENT_MENU', to.name)
})




new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');
