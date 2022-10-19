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

```JavaScript
console.log('\x1B[33m', 'express server is running at http://127.0.0.1:3001');
```

### 一个 scripts 同时运行两个项目

- npm i concurrently
- package.json 中修改 scripts

```json
    "startall": "concurrently \"nodemon ./server/index.js\" \"react-scripts start\" ",
```

其中\\", \为转义符

### `express.static()` 托管静态资源

- express 托管静态资源
- express 在指定的静态目录中查找文件, 并对外提供资源的访问路径, 因此, 存放静态资源的目录名不会出现在 URL 中
- 需要用 path 拼接路径

```JavaScript
const path = require("path")
const app = express()
app.use(express.static(path.join(\_\_dirname, 'public')))
// 资源路径包含在URL中
app.use(`/static`, express.static(path.join(__dirname, 'public')))
```

### 参数传递

#### `params` 动态参数

```JavaScript
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

#### `query` 参数

```JavaScript
// 监听post请求
app.post('/user', (req, res) => {
    // query参数获取, 默认为空对象
    console.log(req.query, '---->query参数');
    // 调用express提供的res.send方法,向客户端相应一个字符串
    res.send('请求成功');
});
```

#### body 请求体数据

```javascript
// 在服务器, 可以使用 req.body 这个属性, 来接收客户端发送过来的JSON格式表单数据 (postman: Body->raw->Text->JSON) 和 url-encoded格式的数据 (postman: Body->x-www-form-urlencoded)
// 默认情况下, 如果不配置解析表单数据的中间件, 则 req.body 默认等于 undefined
app.use(express.json()); // express.json()中间件,解析 JSON 格式表单数据
app.use(express.urlencoded()) // express.urlencoded()中间件, 解析 url-encoded 格式的数据
app.post('/json', (req, res) => {
    console.log(req.body,'---->请求体数据);
    res.send(req.body);
});
```

# 2022/10/13

## node

### Express 路由

每当一个请求到达服务器后, 需要先经过**路由的匹配**, 只有匹配成功后, 才会调用对应的处理函数.  
在请求方式, 请求路径, 全部匹配成功的情况下才会调用对应的处理函数

- 按定义的**先后顺序**进行匹配
- **请求类型**和**请求的 URL** 同时匹配成功,才会调用对应的处理函数

### 模块化路由

#### 将路由抽离为**单独的模块**

- 创建路由模块对应的 .js 文件
- 调用 **express.Route()** 函数创建路由对象
- 向路由对象上挂载具体的路由
- 使用 **module.exports** 向外共享路由对象
- 使用 **app.use()** 函数注册路由模块

#### Example

index.js

```JavaScript
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

```JavaScript
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

```JavaScript
// 导入路由模块
const userRouter = require('./router/user.js');

// 使用app.user()注册路由模块, 并添加统一的访问前缀 /api
app.use('api', userRouter);
```

### 中间件

#### 中间件作用

多个中间件之间, **共享同一份 req 和 res**, 基于这样的特性, 可以在**上游**中间件中, **统一**为 req 或 res 对象添加**自定义**的**属性**和**方法**, 供下游中间件或路由使用

#### 中间件分类

- 应用级别
- 路由级别
- 错误级别
- Express 内置的中间价
- 第三方中间件
- 自定义中间件

##### 应用级别的中间件

通过 **app.use()** 或 **app.get()** 或 **app.post()**, _绑定到 app 实例上的中间件_, 叫做应用级别的中间件

##### 路由级别的中间件

绑定到 **express.Router()** 实例上的中间件, 叫做路由级别的中间件. 它的用法和应用级别中间件没有任何区别. _应用级别中间件绑定到 app 实例上, 路由级别中间件绑定到 Router 实例上_.

##### 错误级别的中间件

错误级别中间件的**作用**: 专门用来**捕获整个项目中发生的异常错误**, 从而防止项目异常崩溃的问题  
**格式**: 错误级别中间件的 function 处理函数中, **必须有 4 个形参**, 形参顺序从前往后, 分别是(**err**,req,res,next)  
错误级别的中间件, **必须注册在所有路由之后**!

```JavaScript
// 错误级别中间件
app.get('/err', (req, res) => {                 // 1.路由
    throw new Error('服务器内部发生了错误!')      // 1.1抛出一个自定义的错误
    res.send('Home Page.')                      // 这里的res.send()不会被触发, 因为前一行已经报错, 停止运行当前的响应函数
})

app.use((err, req, res, next) => {              // 2.错误级别中间件 捕获整个项目的异常错误
    console.log(`发生了错误: ${err.message}`);   // 2.1在服务器打印错误消息
    res.send(`Error!  ${err.message}`)          // 2.2向客户端响应错误消息相关的内容
})
```

##### Express 内置的中间价

自 Express 4.16.0 版本开始, Express 内置了 **3** 个常用的中间件,极大提高了 Express 项目的开发效率和体验:

- **express.static** 快速托管静态资源的中间件, 例如: HTML 文件, 图片, CSS 样式等(无兼容性)
- **express.json** 解析 JSON 格式的请求体数据(_有兼容性_, 仅在 4.16.0+版本中可用)
- **express.urlencoded** 解析 URL-encoded 格式的请求体数据(_有兼容性_, 仅在 4.16.0+版本中可用)

```JavaScript
// 配置解析 application/json格式数据的内置中间件
app.use(express.json())
// 配置解析 application/x-www-form-urlencoded 格式数据的内置中间件
app.use(express.urlencoded({ extended : false} ))
```

##### 第三方中间件

非 Express 官方内置的, 而是由第三方开发出来的中间件, 在项目中按需下载并被指第三方中间件

- 运行 **npm install \[中间件名称\]** 安装中间件
- 使用 **require** 导入中间件
- 调用 **app.use()** 注册并使用中间件

##### 自定义中间件

自定义一个类似于 **express.urlencoded()** 中间件的自定义中间件

```JavaScript
const qs = require('querystringify')
// 自定义中间件
app.use((req, res, next) => {
    // 定义中间件具体的业务逻辑
    // 1. 定义一个str字符串, 专门用来储存客户端发送过来的请求体数据 (数据过大时, 客户端会将数据切片, 分批次发送到服务端, 所以每次服务端接收到的数据不一定是完整的数据)
    let str = ''

    // 2. 监听req的data事件, 将每一片数据拼接到str字符串内(隐式转换)
    req.on('data', (chunk) => {
        str += chunk
    })

    //3. 监听req的end事件, 触发end事件, 则数据传输完成
    req.on('end', () => {
        // 使用querystringfy.parse()方法, 把查询字符串解析为对象
        const body = qs.parse(str)
        req.body = body // 将转换完成的对象挂载到req上 (中间件共用同一套req和res)
        next() // 调用next() 流转到下一个中间件或路由
    })
})
```

#### Express 中间件流转过程

![Express中间件流转过程](/public/readme/images/express_middleware_flow.png)

#### Express 中间件格式

![Express中间件格式](/public/readme/images/express_middleware.png)

#### 注意事项

- 一定要在**路由之前**注册中间件 **(除了错误级别的中间件)**
- 客户端发送过来的请求, **可以连续调用多个**中间件进行处理
- 执行完中间件函数后, **不要忘记调用 next()函数**
- 为了**防止代码逻辑混乱**, next()之后不要再写额外的代码
- 连续调用多个中间件时, 多个中间件之间, **共享**req 和 res 对象

#### Example

##### 全局中间件

```JavaScript
// 定义全局中间件 所有路由都会触发
// next() 将流转关系
// 注册中间件
app.use((req, res, next) => {
    const startTime = new Date()
    req.startTime = startTime
    console.log('---->全局中间件')
    next()
})
// 下游中间件或路由的 req 对象中就会包含 startTime 属性
```

##### 单一局部中间件

```JavaScript
// 注册中间件
const mw = (req, res, next) => {
    console.log('局部中间件');
    next()
}
// 只会针对当前路由触发中间件
app.post('/', mw, (req, res) => {
    res.send('请求成功')
})
// 不使用app.use()注册的中间件, 只在当前路由中生效, 不会影响其他的路由
```

##### 同时使用多个局部中间件

```JavaScript
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
app.post('/', mw1, mw2, (req, res) => {
    res.send('请求成功')
})
// 多个局部中间件触发也可以用数组包裹, 等效于下面这种写法
app.post('/', [mw1, mw2], (req, res) => {
    res.send('请求成功')
})
// 不使用app.use()注册的中间件, 只在当前路由中生效, 不会影响其他的路由
```

# 2022/10/18

## node

### 解析 application/json 格式数据的内置中间件 `express.json()`

```JavaScript
app.use(express.json())
```

### 解析 application/x-www-form-urlencoded 格式数据的内置中间件 `express.urlencoded({ extended : false} )`

```JavaScript
app.use(express.urlencoded({ extended : false} ))
```

### 接口跨域 cors 中间件

- 下载 npm i cors
- 导入 cors
- 注册 cors 中间件

```JavaScript
    // 导入cors
    const cors = require('cors')
    // 注册cors
    app.use(cors())
```

### 接口跨域 jsonp 方式

返回一个将数据作为参数传递的函数调用的字符串 `funcName(data)`

```JavaScript
// jsonp方式跨域
app.get('/jsonp', (req, res) => {
    // 拿到请求的函数名称
    const funcName = req.query.callback
    // 定义要发送给客户端的数据对象
    const data = { name: 'zs', age: 22 }
    // 拼接出函数的调用 funcName(data)
    const scriptStr = `${funcName}(${JSON.stringify(data)})`
    // 把拼接的字符串相应给客户端
    res.send(scriptStr)
})
```

# 2022/10/19

## 数据库

### 传统型数据库的数据组织结构

![Express中间件格式](/public/readme/images/tradition_db_structure.png)

- 实际项目开发中, 一般情况下, 每个项目都对应**独立的数据库**
- 不同的数据,要存储到数据库的不同表中, 例如: 用户数据储存到 users 表中, 图书数据存储到 books 表中
- 每个表中具体存储那些信息, 由字段来决定, 例如: 我们可以为 users 表设计 id, username, password 这 3 个字段
- 表中的行, 代表一条数据

## MySQL

### SELECT

SELECT 语句用于**从表中查询数据**. 执行的结果被存储在一个**结果表中**

```markdown
-- 注释
-- 从 FORM 指定的[表]中, 查询出[所有的]数据. * 表示[所有列]
[SELECT] * [FROMM] 表名称

-- 从FORM 指定的[表]中, 查询出指定 列名称(字段) 的数据
[SELECT] 列名称 [FORM] 表名称
```

注: SQL 语句中的*关键*字对**大小写不敏感**. SELECT 等效于 select, FORM 等效于 from

### INSERT INTO

INSERT INTO 语句用于向数据表中**插入新的数据行**, 语法格式如下

```markdown
-- 语法解读: 向指定的表中, 插入如下几列数据, 列的值通过 values 一一指定
-- 注意: 列和值要一一对应, 多个列和多个值之间, 使用英文的逗号分隔
[INSERT] [INTO] table_name (列1, 列2,...) [VALUES] (值1,值2,...)
```

### UPDATE

UPDATE 语句用于**修改表中的数据**, 语法格式如下
```markdown
-- 语法解读: 
-- 1. 用 UPDATE 指定要更新哪个表中的数据
-- 2. 用SET指定列对应的新值
-- 3. 用WHERE 指定更新的条件
[UPDATE] 表名称 [SET] 列名称 = 新值 [WHERE] 列名称 = 某值
```
