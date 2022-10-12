const express = require('express')

// 创建服务器
const app = express()

// express托管静态资源
// express在指定的静态目录中查找文件, 并对外提供资源的访问路径, 因此, 存放静态资源的目录名不会出现在URL中
app.use(express.static('./public'))

// // 监听get请求
// // :id和:name 为动态参数
// app.get('/user/:id/:name', (req, res) => {
//     // query参数获取, 默认为空对象
//     console.log(req.query, '---->query参数');
//     // params参数获取,:id为动态参数
//     console.log(req.params, '====>params动态参数')
//     // 调用express提供的res.send方法,向客户端相应一个JSON对象
//     res.send({ name: "zs", age: 18, gender: "男" })
// })

// // 监听post请求
// app.post('/user', (req, res) => {
//     // query参数获取, 默认为空对象
//     console.log(req.query, '---->query参数');
//     // 调用express提供的res.send方法,向客户端相应一个字符串
//     res.send('请求成功')
// })

// 终端显示console为黄色
app.listen(3001, () => {
    console.log('\x1B[33m', 'express server is running at http://127.0.0.1:3001');
})