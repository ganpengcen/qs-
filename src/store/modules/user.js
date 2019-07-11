
import { getToken, setToken, removeToken, setRefreshToken, getRefreshToken, removePermissionList } from '@/utils/auth'
import { Post } from "@/api/api";
import dynamicRoutes from '@/router/dynamic-router'
import { recursionRouter, setDefaultRoute } from '@/utils/recursion-router'
import router, { DynamicRoutes } from '@/router/index'
import Api from "../../kites/api";
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const user = {
  state: {
    Host: config.Host,
    token: getToken(),
    name: '',
    avatar: '',
    permissionList: [] /** 所有路由 */,
    sidebarMenu: [] /** 导航菜单 */,
    currentMenu: '' /** 当前active导航菜单 */
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_RETOKEN: (state, token) => {
      state.refresh_token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSION: (state, routes) => {
      state.permissionList = routes
    },
    CLEAR_PERMISSION(state) {
      state.permissionList = []
    },
    SET_MENU(state, menu) {
      state.sidebarMenu = menu
    },
    SET_CURRENT_MENU(state, currentMenu) {
      state.currentMenu = currentMenu
    },
    CLEAR_MENU(state) {
      state.sidebarMenu = []
    }
  },

  actions: {
    // 登陆
    async Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const data = "grant_type=password&username=" + username + "&password=" + userInfo.password;
      try {
        const res = await Post(Api.tokens, data);//调用登陆请求方法  
        setToken(res.access_token)
        //   setRefreshToken(res.refresh_token)//保存refresh_token
        commit('SET_TOKEN', res.access_token)
        //   commit('SET_RETOKEN', res.refresh_token)
      } catch (e) {
        removeToken();
      }
    },
    // 刷新token
    async refreshToken({ commit }, reToken) {
      let url = "/oauth/token";
      const dataR = "grant_type=refresh_token&refresh_token=" + reToken + "&client_id=app&client_secret=app";
      try {
        const res = await Post(url, dataR);//调用刷新token方法
        setToken(res.access_token)
        setRefreshToken(res.refresh_token)//保存refresh_token
        commit('SET_TOKEN', res.access_token)
        commit('SET_RETOKEN', res.refresh_token)
      } catch (e) {
        console.log(e);
      }
    },
    // 获取路由数据
    async FetchPermission({ commit, state }) {
      let res = { "result": [{ "title": "工作台", "childs": [] }, { "title": "大数据展示", "childs": [] }, { "title": "管理", "childs": [{ "title": "组织架构单元", "childs": [] }, { "title": "角色", "childs": [] }, { "title": "用户", "childs": [] }, { "title": "语言列表", "childs": [] }, { "title": "审计日志", "childs": [] }, { "title": "维护", "childs": [] }] }, { "title": "基础数据", "childs": [{ "title": "字典数据", "childs": [] }, { "title": "区域", "childs": [] }, { "title": "上报单位", "childs": [] }] }, { "title": "设备管理", "childs": [{ "title": "设备列表", "childs": [] }] },{ "title": "区域管理", "childs": [{ "title": "区域列表", "childs": [] }] },{ "title": "监管人员管理", "childs": [{ "title": "人员列表", "childs": [] }] }, { "title": "意见反馈", "childs": [] },], "targetUrl": null, "success": true, "error": null, "unAuthorizedRequest": false, "__abp": true }
      let url = "/api/menu/getMenuPages";
      // const res = await Post(url, {});
      if (res.success) {
        if (res.result.length == 0) {
          commit('CLEAR_PERMISSION')
          commit('CLEAR_MENU');
          removeToken();
          removePermissionList();
          window.location.reload();
        } else {
          let permissionList = res.result;
          /*  根据后台权限跟定义好的权限对比，筛选出对应的路由并加入到path=''的children */
          let routes = recursionRouter(permissionList, dynamicRoutes)
          for (let i = 0; i < routes.length; i++) {
            if (routes[i].name === 'big-data') {
              let arr = [{
                path: '/bigData',
                component: resolve => require(['page/big-data-manage/dashboard'], resolve),
              },
              //大数据 法律咨询
              {
                path: '/pageTwo',
                component: resolve => void (require(['page/big-data-manage/pageTwo'], resolve)),
              },
              //大数据 社区矫正
              {
                path: '/pageThree',
                component: resolve => void (require(['page/big-data-manage/pageThree'], resolve)),
              }]
              DynamicRoutes.push(...arr);
            }
          }
          let MainContainer = DynamicRoutes.find(v => v.path === '/')
          let children = MainContainer.children
          children.push(...routes)
          let welcome = {
            path: 'welcome',
            name: 'p-welcome',
            component: resolve => require(['page/welcome.vue'], resolve),
            meta: {
              title: '欢迎',
              icon: "icon-xs-zhuye",
            },
          }
          let flag = false;
          for (let i = 0; i < children.length; i++) {
            if (children[i].path == "dashboard") {
              flag = true;
              break;
            }
          }
          if (!flag) {
            children.unshift(welcome);
          }

          /* 生成左侧导航菜单 */
          commit('SET_MENU', children)

          setDefaultRoute([MainContainer])

          /*  初始路由 */
          let initialRoutes = router.options.routes

          /*  动态添加路由 */
          router.addRoutes(DynamicRoutes)

          /* 完整的路由表 */
          commit('SET_PERMISSION', [...initialRoutes, ...DynamicRoutes])
        }

      }

    },

    // 登出
    LogOut({ commit, state }) {
      let MainContainer = DynamicRoutes.find(v => v.path === '/')
      //清空数据，防止由于页面不刷新造成的路由重复添加 
      MainContainer.children = [];//清空原先添加的路由
      return new Promise((resolve, reject) => {
        commit('CLEAR_PERMISSION')
        commit('CLEAR_MENU');
        removeToken();
        removePermissionList();
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
