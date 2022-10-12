# Markdown 语法参考

\# 一级标题  
\## 二级标题  
\##### 五级标题  
\- 列表第一项  
\- 列表第二项  
\1. 有序列表第一项  
\2. 有序列表第二项  
\[标题](链接地址)  
\![图片描述](图片链接地址) \*斜体\*  
\*\*粗体\*\*  
\> 引用段落  
\```代码块```  

# 2022/10/12

## node

### console.log() 带颜色

console.log('\x1B[33m','express server is running at http://127.0.0.1:3001');

### 一个 scripts 同时运行两个项目

(1) npm i concurrently  
(2) package.json 中修改 scripts  
```
    "startall": "concurrently \"nodemon ./server/index.js\" \"react-scripts start\" ",
```  
其中\\", \为转义符  

### express.static() 托管静态资源

(1) express 托管静态资源  
(2) express 在指定的静态目录中查找文件, 并对外提供资源的访问路径, 因此, 存放静态资源的目录名不会出现在 URL 中  
(3) 需要用 path 拼接路径  

```
    const path = require("path")
    const app = express()
    app.use(express.static(path.join(\_\_dirname, 'public')))
```

### 参数传递

#### params 动态参数

```
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
```

#### query 参数

```
    // 监听post请求
    app.post('/user', (req, res) => {
        // query参数获取, 默认为空对象
        console.log(req.query, '---->query参数');
        // 调用express提供的res.send方法,向客户端相应一个字符串
        res.send('请求成功')
    })
```
