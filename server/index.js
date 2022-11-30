const express = require('express')
const app = express()

// 别名配置
require('module-alias/register')

// 跨域配置
const cors = require('cors')
app.use(cors())

// 解析数据格式 application/x-www-form-urlencoded res.body 接收数据
app.use(express.urlencoded({ extended: false }))

// 托管静态资源
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// token解析 /users 开头的路由不需要权限
const { expressjwt: expressJWT } = require('express-jwt')
const { TokenSecretKey: secret } = require('@root/config')
app.use(expressJWT({ secret, algorithms: ['HS256'] }).unless({ path: [/^(\/user\/)|(\/postal\/)/] }))

// 导入用户模块路由
const userRouter = require('./router/user')
app.use('/user', userRouter)

// 导入api权限路由
const apiRouter = require('./router/api')
app.use('/api', apiRouter)

// 导入postal路由
const postalRouter = require('./router/postal')
app.use('/postal', postalRouter)

// 错误中间件
app.use((err, req, res, next) => {
    // token解析失败导致的错误
    if (err.name === 'UnauthorizedError') {
        if (err.status === 401) return res.status(401).send({ status: 'fail', msg: '用户未登录或token失效', code: err.code })
        return res.status(500).send({ status: "fail", message: "无效的token" })
    }
    // 其他错误
    res.send(`Error!  ${err.message}`)
})

const { serverAddress: address, serverPort: port } = require('@root/config')
app.listen(port, () => {
    console.log('\x1B[33m', `express server is running at ${address}:${port}`);
}) 