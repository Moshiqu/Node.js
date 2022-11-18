import axios from 'axios';

const instance = axios.create({
    // baseURL: '127.0.0.1:3001',
    timeout: 20000
})

// 请求拦截器
instance.interceptors.request.use(config => {
    if (config.method === 'post') {
        config.headers = { "content-type": "application/x-www-form-urlencoded" }
    }
    return config
}, err => {
    return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(res => {
    return res.data
}, err => {
    return Promise.reject(err)
})

export default instance