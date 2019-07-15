import axios from 'axios'
import {
    Message,
    Loading,
    MessageBox
} from 'element-ui'
import store from '../store/index'
import {
    getToken,
    removeToken,
    getRefreshToken
} from '@/utils/auth'
import router from '@/router/index'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API + "/api", // api的base_url 开发模式
    //baseURL: config.Host , // 线上
    timeout: 20000 // 请求超时时间
})
let loading        //定义loading变量
function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}

// request拦截器
service.interceptors.request.use(config => {
    if (store.getters.token) {
        config.headers.Authorization = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    let apiUrl = config.url.match('[^/]+(?!.*/)')[0];//接口名
    if (apiUrl !== 'GetServiceAgencyMembers') {
       startLoading()
    }   
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        endLoading()
        if (typeof res === "undefined") {
            return Promise.reject('error')
        } else {
            return res;
        }
    },
    error => {
        endLoading()
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    store.commit('SET_TOKEN', '')
                    removeToken()
                    let reToken = getRefreshToken();
                    store.dispatch('refreshToken', reToken).then(() => {
                    }).catch((err) => {
                        console.log(err)
                    })
                    break;
                case 403:
                    router.push("/403");
                    break;
                default:
                    break;
            }
        }
        Message({
            // message: error.message,
            // message: error.message + error.response.data.error.message,
            message:  error.response.data.message + "("+ error.response.status+ "): " + error.response.data.exceptionMessage,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error.response) // 返回接口返回的错误信息
    }
)


export default service
