const express = require('express')
const path = require("path")

// 创建服务器
const app = express()

// 引入路由文件
const router = require('./router')
app.use(router)

// express托管静态资源
// express在指定的静态目录中查找文件, 并对外提供资源的访问路径, 因此, 存放静态资源的目录名不会出现在URL中
// 需要用path拼接路径
app.use(express.static(path.join(__dirname, 'public')))

// 托管多个静态资源, 从上往下一层一层找
app.use(express.static(path.join(__dirname, 'static')))

// 资源路径包含在URL中
app.use(`/static`, express.static(path.join(__dirname, 'public')))

// express.json(),解析 JSON 格式的请求体数据
app.use(express.json())
app.post('/json', (req, res) => {
    console.log(req.body);
    res.send(req.body)
})

const qs = require('querystringify')

// 自定义中间件
app.use((req, res, next) => {
    // 定义中间件具体的业务逻辑
    // 1. 定义一个str字符串, 专门用来储存客户端发送过来的请求体数据( 数据过大时, 客户端会将数据切片, 分批次发送到服务端, 所以每次服务端接收到的数据不一定是完整的数据)
    let str = ''

    // 2. 监听req的data事件, 将每一片数据拼接到str字符串内(隐式转换)
    req.on('data', (chunk) => {
        str += chunk
    })

    //3. 监听req的end事件, 触发end事件, 则数据传输完成
    req.on('end', () => {
        // 使用querystringfy.parse()方法, 把查询字符串解析为对象
        const body = qs.parse(str)
        req.body = body
        next() // 调用next() 流转到下一个中间件或路由
    })
})

app.post('/custom', (req, res) => {
    res.send('ok')
})

// 定义全局中间件
// next() 将流转关系
// 注册中间件
app.use((req, res, next) => {
    const startTime = new Date()
    req.startTime = startTime
    next()
})

// 局部生效中间件
// 不使用app.use()注册的中间件, 只在当前路由中生效, 不会影响其他的路由
const mw = (req, res, next) => {
    console.log('局部中间件');
    next()
}
app.post('/', mw, (req, res) => {
    res.send('请求成功')
})

// 注册中间件1
const mw1 = (req, res, next) => {
    console.log('局部中间件--->1');
    next()
}
// 注册中间件2
const mw2 = (req, res, next) => {
    console.log('局部中间件--->2');
    next()
}
// 只会针对当前路由触发中间件, 并且从中间件1到中间件2依次触发
app.post('/mw', mw1, mw2, (req, res) => {
    res.send('请求成功')
})
// 不使用app.use()注册的中间件, 只在当前路由中生效, 不会影响其他的路由

// 监听get请求
// :id和:name 为动态参数
app.get('/user/:id/:name', (req, res) => {
    // query参数获取, 默认为空对象
    console.log(req.query, '---->query参数');
    // params参数获取,:id为动态参数
    console.log(req.params, '====>params动态参数')
    // 调用express提供的res.send方法,向客户端相应一个JSON对象
    res.send({ name: "zs", age: 18, gender: "男" })
})

// 监听post请求
app.post('/user', (req, res) => {
    // query参数获取, 默认为空对象
    console.log(req.query, '---->query参数');
    console.log(req.startTime, '====>上游中间件给req对象添加的属性');
    // 调用express提供的res.send方法,向客户端相应一个字符串
    res.send('请求成功')
})

// 错误级别中间件
app.get('/err', (req, res) => {                 // 1.路由
    throw new Error('服务器内部发生了错误!')      // 1.1抛出一个自定义的错误
    res.send('Home Page.')
})

// jsonp方式跨域
app.get('/jsonp', (req, res) => {
    console.log(req.query);
    // 拿到请求的函数名称
    const funcName = req.query.callback
    // 定义要发送给客户端的数据对象
    const data = { name: 'zs', age: 22 }
    // 拼接出函数的调用 funcName(data)
    const scriptStr = `${funcName}(${JSON.stringify(data)})`
    // 把拼接的字符串相应给客户端
    res.send(scriptStr)
})

app.use((err, req, res, next) => {              // 2.错误级别中间件
    console.log(`发生了错误: ${err.message}`);   // 2.1在服务器打印错误消息
    res.send(`Error!  ${err.message}`)          // 2.2向客户端响应错误消息相关的内容
})



// 监听3001端口 启动服务器
app.listen(3001, () => {
    // 终端显示console为黄色
    console.log('\x1B[33m', 'express server is running at http://127.0.0.1:3001');
})