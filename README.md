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
临时使用 cnpm
npm --registry https://registry.npm.taobao.org install [依赖的名称]

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
    // **这里如果没监听到data事件, 则请求会一直挂起 不知道为啥一直监听不到data事件!!!**
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
-- 从 FORM 指定的[表]中, 查询出[所有的]数据. _ 表示[所有列]
[SELECT] _ [FROMM] 表名称

-- 从 FORM 指定的[表]中, 查询出指定 列名称(字段) 的数据
[SELECT] 列名称 [FORM] 表名称
```

注: SQL 语句中的*关键*字对**大小写不敏感**. SELECT 等效于 select, FORM 等效于 from

### INSERT INTO

INSERT INTO 语句用于向数据表中**插入新的数据行**, 语法格式如下

```markdown
-- 语法解读: 向指定的表中, 插入如下几列数据, 列的值通过 values 一一指定
-- 注意: 列和值要一一对应, 多个列和多个值之间, 使用英文的逗号分隔
[INSERT] [INTO] table_name (列 1, 列 2,...) [VALUES] (值 1,值 2,...)
```

### UPDATE

UPDATE 语句用于**修改表中的数据**, 语法格式如下

```markdown
-- 语法解读:
-- 1. 用 UPDATE 指定要更新哪个表中的数据
-- 2. 用 SET 指定列对应的新值
-- 3. 用 WHERE 指定更新的条件
[UPDATE] 表名称 [SET] 列名称 = 新值 [WHERE] 列名称 = 某值
```

# 2022/10/26

## node 中操作 MySQL

- 安装操作 MySQL 数据库的第三方模块(mysql)
- 通过 mysql 模块连接到 MySQL 数据库
- 通过 mysql 模块执行 SQL 语句

### 创建连接

```JavaScript
// 导入mysql包
const mysql = require('mysql')

//创建数据库的连接
const db = mysql.createPool({
    host:"127.0.0.1",// ip地址 可以省略, 如果省略则是localhost
    user:"root", // 用户名
    password:"12345", // 密码
    database:"test" // 具体数据库名称
})
```

### 查询语句

执行**SELECT**查询语句 则执行的结果是数组

```JavaScript
const selectSql = 'select * from users'

db.query(selectSql, (err, results) => {
    // 打印错误信息
    if (err) return console.log(err.message)
    // 返回为RowDataPacket对象数组 JSON.parse(JSON.stringify(results))可以转为普通对象数组
    results = JSON.parse(JSON.stringify(results))
    console.log(results);
})
```

### 新增语句(插入)

执行**INSERT INTO**插入语句, 则返回的结果是一个对象

#### 方式一

```JavaScript
// 新数据内容
const newUser = { username: new Date().toLocaleString(), password: "321654" }
// const insertSql = `INSERT INTO users (username,password) VALUES(${newUser.username},${newUser.password})`模板字符串可能会导致sql注入
// sql语句 ? 表示占位符 占位符可以防止sql注入
const insertSql = 'INSERT INTO users (username,password) VALUES(?,?)'

// 数组形式将值传进去
db.query(insertSql,[newUser.username,newUser.password],(err,results)=>{
    if(err) return console.log(err.message);
    // 如果受影响的行数为1, 则插入成功
    if(results.affectedRows === 1) console.log('插入数据成功');
})
```

#### 方式二

向表中新增数据时, 如果数据对象的每个属性和数据表的字段一一对应, 则可以通过以下方式快速插入数据

```JavaScript
const newUser = { username: new Date().toLocaleString(), password: "321654" }
const insertSql = `INSERT INTO users SET ?`

db.query(insertSql, newUser, (err, results) => {
    if (err) return console.log(err.message);
    // 如果受影响的行数为1, 则插入成功
    if (results.affectedRows === 1) console.log('插入数据成功');
})
```

### 更新语句(修改)

#### 方式一

```JavaScript
// SET 后具体要修改的字段, WHERE 后查找条件
const updateSql = "UPDATE users SET password = ?, email = ?, nickname=? WHERE username = ?"
const editedUserInfo = { email: '123@qq.com', nickname: "zsChanged", password: "321654987" }
const modifiedUsername = 'zs'
let { email, nickname, password } = editedUserInfo // 结构赋值
db.query(updateSql, [password, email, nickname, modifiedUsername], (err, results) => {
    if (err) return console.log(err.message);
    if(results.affectedRows === 1) console.log('更新成功');
})
```

#### 方式二

```JavaScript
const updateSql = `UPDATE users SET ? WHERE username = ?`
const editedUserInfo = { email: '123@qq.com', nickname: "zsChanged2", password: "321654987" }
const modifiedUsername = 'zs'
db.query(updateSql, [editedUserInfo, modifiedUsername], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) console.log('更新成功');
})
```

### 删除语句

推荐使用**主键**或**唯一标识**进行查找, 例如 id 字段  
项目中一般不使用真正的删除语句, 而是使用*标记删除*的方式模拟删除的动作:  
is_active 或 status 字段用于记录当前记录是否删除, is_active 为 false, 则为删除; is_active 为 true, 则为未删除.  
执行*标记删除*, 使用修改语句将 is_active 修改为 false

#### 真删除

```JavaScript
const deleteSql = 'DELETE FROM users WHERE username = ? AND email = ? '
const deleteUsername = '2022/10/26 17:53:39'
db.query(deleteSql, [deleteUsername, '321'], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) console.log('删除成功');
})
```

#### 标记删除

```JavaScript
// 修改 is_acitve 字段为false
const fakeDeleteSql = `UPDATE users SET is_acitve = false WHERE username = ? AND email = ? AND is_active = true `
const deleteUsername = '2022/10/26 17:53:39'
db.query(fakeDeleteSql, [deleteUsername, '321'], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) console.log('删除成功');
    console.log(results);
})
```

# 2022/10/27

## 前后端身份认证

- **服务端渲染**推荐使用 _Session 认证机制_
- **前后端分离**推荐使用 _JWT 认证机制_

## Session

### Session 认证机制

- 了解 HTTP 协议的无状态性是进一步学习 Session 认证机制的必要前提
- HTTP 协议的无状态性, 指的是客户端的*每次 HTTP 请求都是独立的*, 连续多个请求之间没有直接的关系, **服务器不会主动保留每次 HTTP 请求的状态**  
  ![HTTP无状态性](/public/readme/images/HTTP_cookie_1.png)
- 身份请求认证方式: 为 HTTP 请求添加 **Cookie**  
  ![HTTP无状态性](/public/readme/images/HTTP_cookie_2.png)

#### Cookie

Cookie 是**储存在用户浏览器中的不超过 4KB 的字符串**. 它由一个*名称*(Name)、一个*值*(Value)和其他几个用于控制 Cookie _有效期_、_安全期_、*使用范围*的**可选属性**组成  
不同域名下的 Cookie 各自独立, 每当客户端发起请求时, 会**自动**把**当前域名**下的所有**未过期的 Cookie** 一同发送到服务器

cookie 特性:

- 自动发送
- 域名独立
- 过期时限

#### Cookie 在身份认证中的作用

客户端第一次请求服务器的时候, 服务器**通过响应头的形式**, 向客户端发送一个身份认证的 Cookie, 客户端会自动将 Cookie 保存在浏览器中.  
随后, 当客户端浏览器每次请求服务器的时候, 浏览器会**自动**将身份认证相关的 Cookie, **通过请求头的形式**发送给服务器, 服务器即可严明客户端的身份.
![HTTP无状态性](/public/readme/images/cookie_flow_graph.png)

#### Cookie 不具有安全性

由于 Cookie 是存储在浏览器中的, 而且**浏览器也提供了读写 Cookie 的 API**, 因此 Cookie **很容易被伪造**, 不具有安全性. 因此不建议服务器将重要的隐私数据,通过 Cookie 的形式发送给浏览器
![HTTP无状态性](/public/readme/images/HTTP_cookie_3.png)

### Session 认证的工作原理

![HTTP无状态性](/public/readme/images/session_principle.png)

### 在 Express 中使用 Session 认证

#### express-session 中间件安装成功后, 需要通过 app.use()来注册 session 中间件

```JavaScript
// 导入session中间件
const session = require('express-session')
// 配置 session中间件
app.use(session({
    secret: 'keybord cat', // secret 属性值可以为任意字符串, 用于加密, 字符串越复杂, 加密程度越高
    resave: false, // 固定写法
    saveUninitialized: true // 固定写法
}))
```

#### 通过 req.session 来访问和使用 session 对象, 从而存储用户的关键信息

express-session 中间件注册后, req 对象中会有一个属性名为 session 的对象

```JavaScript
// 用户的登录 并将用户信息存储到session中
app.post('/api/login', (req, res) => {
    if (req.body.username !== 'admin' || req.body.password !== '12345') {
        return res.send({ status: 1, msg: '登录失败' })
    }

    req.session.user = req.body // 将用户信息存储到Session中
    req.session.islogin = true // 将用户的登录状态存储到Session 中
    res.send({ status: 0, msg: '登录成功' })
})
```

```JavaScript
// 从session中拿到用户名和登录状态, 如果登录成功,将用户名返回
app.post('/api/username', (req, res) => {
    if (!req.session.islogin) return res.send({ status: 1, message: '用户未登录!' })
    res.send({ status: 0, message: 'success', username: req.session.user.username })
})
```

#### 清空 session

调用 req.session.destroy()函数, 即可清空服务器保存的 session 信息
**只会清空当前用户的信息, 不会清空所有用户信息**

```JavaScript
// 退出登录
app.post('/api/logout', (req, res) => {
    req.session.destroy()
    res.send({ status: 0, message: 'success' })
})
```

### Session 认证的局限性

Session 机制需要**配合 Cookie 才能实现**. 由于 Cookie 默认不支持跨域访问, 所以, 当涉及到*前端跨域请求后端接口*的时候, **需要做很多额外的配置**, 才能实现跨域 Session 认证

- 当前端请求后端接口**不存在跨域问题**的时候, **推荐使用 Session** 身份认证机制
- 当前端需要跨域请求后端接口的时候, 不推荐使用 Session 身份认证机制, 推荐使用 JWT 认证机制

## JWT

### JWT 认证的工作原理

![HTTP无状态性](/public/readme/images/JWT_principle.png)

### JWT 组成部分

JWT 通常由三部分组成, 分别是**Header**(头部)、**Payload**(有效荷载)、**Signature**(签名).

三者之间使用英文的"."分隔, 格式如下:

```
Header.Payload.Signature
```

- Header 和 Signature 是安全性相关的部分, 用于保护 token 的安全性
- Payload 才包含用户的真实信息

### JWT 的使用方式

客户端收到服务器返回的 JWT 之后, 通常会将它储存到 **localStorage** 或 **sessionStorage** 中  
此后, 客户端每次与服务器通信, 都要带上这个 JWT 的字符串, 从而进行身份认证. 推荐做法是把 JWT 放在 **HTTP 请求头的 Authorization 字段中**, 格式如下

```
Authorization: Bearer<token>
```

### 在 Express 中使用 JWT 认证

#### 安装 JWT 相关的包

- jsonwebtoken 用于生成 JWT 字符串
- express-jwt 用于将 JWT 字符串解析还原成 JSON 对象

#### 定义密钥

```JavaScript
// 定义密钥 JWT的加密和解密都需要依靠同一个加密密钥
const secretKey = 'test secretKey'
```

#### 生成 JWT jsonwebtoken.sign()

通过 jsonwebtoken 包的 sign()方法生成 JWT 字符串

- sign()三个参数分别是: 用户信息对象、加密密钥、配置对象

```JavaScript
// 登录后生成JWT字符串
app.post('/api/jwt/login', (req, res) => {
    const { username, password } = req.body
    if (!(username === 'admin' && password === '12345')) return res.send({ status: 1, message: "登录失败" })
    // 登录成功后生成JWT字符串, 通过token字段响应给客户端
    // 调用 jwt.sign() 生成 JWT 字符串, 三个参数分别是: 用户信息对象、加密密钥、配置对象
    res.send({ status: 1, message: "登录成功", token: jwt.sign({ username: username }, secretKey, { expiresIn: '30s' }) }) // expiresIn token有效期
})
```

#### 将 JWT 字符串还原为 JSON 对象 express-jwt

客户端每次在访问有权限接口的时候, 都需要主动通过**请求头中的 Authorization 字段**, 将 Token 字符串发送到服务器进行身份认证
此时, 服务器跨域通过 _express-jwt_ 这个中间件, 自动将客户端发送过来的 Token 解析还原成 JSON 对象

```JavaScript

const { expressjwt: expressJWT } = require('express-jwt')
//使用app.use()来中注册中间件
// expressJwt({secret:secretKey}) 就是用来解析Token的中间件
// .unless({path:[/^\/api\/\]})用来指定哪些接口不需要访问权限
app.use(expressJWT({ secret: secretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//] }))
// expressJWT中间件注册成功后, 就可以把解析出来的用户信息挂载到req对象的auth属性上
app.get('/admin/userinfo', (req, res) => {
    const { username } = req.auth
    res.send({ status: 0, message: "success", data: { username } })
})
```

#### 捕获解析 JWT 失败后产生的错误

当使用 express-jwt 解析 Token 字符串时, 如果客户端发送过来的 Token 字符串**过期**或**不合法**, 会产生一个解析失败的错误,影响项目的正常运行.  
可以通过**Express 的错误中间件**, 捕获这个错误并进行相关的处理

```JavaScript
// 错误中间件
app.use((err, req, res, next) => {              // 2.错误级别中间件

    // token解析失败导致的错误
    if (err.name === 'UnauthorizedError') {
        return res.send({ status: 401, message: "无效的token" })
    }
    // 其他错误
    console.log(`发生了错误: ${err.message}`);   // 2.1在服务器打印错误消息
    res.send(`Error!  ${err.message}`)          // 2.2向客户端响应错误消息相关的内容
})
```

# 2022/10/27

## 服务器表单验证

安装并导入 express 表单验证的包 express-validator

### 使用

#### 选择要验证的字段 check

```JavaScript
const { check } = require('express-validator');
router.post('/reguser', [
    //字母开头，允许5-16字节，允许字母数字下划线
    check('account').notEmpty().withMessage('账号未设置').matches(/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/).withMessage('账号格式错误'),
    check('email').notEmpty().withMessage('邮箱未设置').isEmail().withMessage('邮箱格式错误'),
    check('password').notEmpty().withMessage('密码未设置').matches(/^[a-zA-Z]\w{5,17}$/).withMessage('密码格式错误'),
    check('repassword').notEmpty().withMessage('二次密码未设置'),
], reguserHandler)
```

#### 获取验证结果

```JavaScript
const { validationResult } = require('express-validator')

const reguserHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        // 未通过验证
        res.send({
            status: 'fail',
            msg: errArray[0].msg
        })
    } else {
        // 通过验证
        const { password, repassword } = req.body
        if (password === repassword) {
            res.send({
                status: 'success',
            })
        } else {
            res.send({
                status: 'fail',
                msg: '两次密码输入不一致'
            })
        }
    }

}
```

#### MySQL 大小写区分

Windows 环境下 MySQL 不会区分大小写

- 字段名
- 字段内容

数据表的字符集, 排序规则会影响是否区分大小写

如要区分大小写:

```mysql
ALTER TABLE table_name CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
```
