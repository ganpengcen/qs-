import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);
/* 初始路由 */
export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            meta: {
                requireAuth: false
            },
            component: resolve => require(['../components/page/Login.vue'], resolve),
        }

    ]
})

/* 准备动态添加的路由 */
export const DynamicRoutes = [
    {
        path: '/',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        name: 'home',
        meta: {
            title: '自述文件'
        },
        children: [
            
        ]
    },
    {
        path: '/404',
        component: resolve => require(['../components/page/404.vue'], resolve)
    },
    {
        path: '/403',
        component: resolve => require(['../components/page/403.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/404'
    }

]



