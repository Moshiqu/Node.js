const express = require('express')
const expressWs = require('express-ws') // 引入 WebSocket 包
const app = express()
expressWs(app)

// 别名配置
require('module-alias/register')

// 建立 WebSocket 服务
// 
// 第一个参数为服务路径： /basic
// 第二个参数为与前端建立连接时会调用的回调函数
//   ws 相当于建立 WebSocket 的实例
//   req 为建立连接的请求
app.ws('/basic', function (ws, req) {
    console.log('connect success')

    // 使用 ws 的 send 方法向连接另一端的客户端发送数据
    ws.send('connect to express server with WebSocket success')

    // 使用 on 方法监听事件
    //   message 事件表示从另一段（服务端）传入的数据
    ws.on('message', function (msg) {
        console.log(`receive message ${msg}---`)
        ws.send('default response')
    })

    // 设置定时发送消息
    let timer = setInterval(() => {
        ws.send(`interval message ${new Date()}`)
    }, 2000)

    // close 事件表示客户端断开连接时执行的回调函数
    ws.on('close', function (e) {
        console.log('close connection')
        clearInterval(timer)
        timer = undefined
    })
})


const { serverAddress: address, serverSocketPort: port } = require('@root/config')
app.listen(port, () => {
    console.log('\x1B[33m', `websocket server is running at ${address}:${port}`);
}) 