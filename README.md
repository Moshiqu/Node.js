# Markdown 语法参考

\# 一级标题  
\## 二级标题  
\##### 五级标题  
\- 列表第一项  
\- 列表第二项  
\1. 有序列表第一项  
\2. 有序列表第二项  
\[标题](链接地址)  
\![图片描述](图片链接地址)  
_斜体_  
**粗体**  
\> 引用段落  
\```代码块```  
一行结束, 两个或大于两个空格为换行符

# 2022/10/12

## node

### console.log() 带颜色

```javascript
console.log('\x1B[33m', 'express server is running at http://127.0.0.1:3001');
```

### 一个 scripts 同时运行两个项目

- npm i concurrently
- package.json 中修改 scripts

```json
    "startall": "concurrently \"nodemon ./server/index.js\" \"react-scripts start\" ",
```

其中\\", \为转义符

### express.static() 托管静态资源

- express 托管静态资源
- express 在指定的静态目录中查找文件, 并对外提供资源的访问路径, 因此, 存放静态资源的目录名不会出现在 URL 中
- 需要用 path 拼接路径

```javascript
    const path = require("path")
    const app = express()
    app.use(express.static(path.join(\_\_dirname, 'public')))
    // 资源路径包含在URL中
    app.use(`/static`, express.static(path.join(__dirname, 'public')))
```

### 参数传递

#### params 动态参数

```javascript
// 监听get请求
// :id和:name 为动态参数
app.get('/user/:id/:name', (req, res) => {
  // query参数获取, 默认为空对象
  console.log(req.query, '---->query参数');
  // params参数获取,:id为动态参数
  console.log(req.params, '====>params动态参数');
  // 调用express提供的res.send方法,向客户端相应一个JSON对象
  res.send({ name: 'zs', age: 18, gender: '男' });
});
```

#### query 参数

```javascript
// 监听post请求
app.post('/user', (req, res) => {
  // query参数获取, 默认为空对象
  console.log(req.query, '---->query参数');
  // 调用express提供的res.send方法,向客户端相应一个字符串
  res.send('请求成功');
});
```

# 2022/10/12

## node

### Express 路由

每当一个请求到达服务器后, 需要先经过**路由的匹配**, 只有匹配成功后, 才会调用对应的处理函数.  
在请求方式, 请求路径, 全部匹配成功的情况下才会调用对应的处理函数

- 按定义的**先后顺序**进行匹配
- **请求类型**和**请求的 URL** 同时匹配成功,才会调用对应的处理函数

### 模块化路由

#### 将路由抽离为**单独的模块**

- 创建路由模块对应的 .js 文件
- 调用**express.Route()**函数创建路由对象
- 向路由对象上挂载具体的路由
- 使用**module.exports**向外共享路由对象
- 使用**app.use()**函数注册路由模块

#### Example

index.js

```javascript
const express = require('express');

// 创建服务器
const app = express();
// 引入路由文件
const router = require('./router');
app.use(router);

// 终端显示console为黄色
app.listen(3001, () => {
  console.log('\x1B[33m', 'express server is running at http://127.0.0.1:3001');
});
```

./router.js

```javascript
const router = require('express').Router();

router.get('/user/list', (req, res) => {
  res.send('Get user list');
});

router.post('/user/add', (req, res) => {
  res.send('Add user');
});

module.exports = router;
```

### 路由模块添加前缀

```javascript
// 导入路由模块
const userRouter = require('./router/user.js');

// 使用app.user()注册路由模块, 并添加统一的访问前缀 /api
app.use('api', userRouter);
```

### 中间件

#### Express中间件格式
![Express中间件格式](/public/readme/images/express_middleware.png)  