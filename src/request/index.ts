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
    const token = localStorage.getItem('token')
    if(token){
        config.headers ={
            "Authorization":`Bearer ${token}`
        }
    }
    return config
}, err => {
    return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(res => {
    return Promise.resolve(res.data)
}, err => {
    if (err.response) {
        // 失败响应的status需要在response中获得
        switch (err.response.status) {
            // 对得到的状态码的处理，具体的设置视自己的情况而定
            case 401:
                console.log('未登录')
                window.location.href = '/'
                break
            case 404:
                window.location.href = '/'
                break
            case 405:
                console.log('不支持的方法')
                break
        }
    }
    return Promise.reject(err.response.data)
})

export default instance