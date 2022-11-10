const express = require('express')
const app = express()

// 跨域配置
const cors = require('cors')
app.use(cors())

// 解析数据格式 application/x-www-form-urlencoded res.body 接收数据
app.use(express.urlencoded({ extended: false }))

// 导入用户模块路由
const userRouter = require('./router/user')
app.use('/user', userRouter)

app.listen(3001, () => {
    console.log('\x1B[33m', 'express server is running at http://127.0.0.1:3001');
}) 