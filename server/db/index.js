const mysql = require('mysql')

const db = mysql.createPool({
    user: "root",
    password: "123456",
    database: "test"
})

// module.exports = db

// 查询语句
// const selectSql = 'select * from users'
// db.query(selectSql, (err, results) => {
//     if (err) return console.log(err.message)
//     results = JSON.parse(JSON.stringify(results))
//     console.log(results);
// })

// // 新增语句(插入)
// const newUser = { username: 'zs1', password: "321654" }
// // const insertSql = `INSERT INTO users (username,password) VALUES(${newUser.username},${newUser.password})`模板字符串可能会导致sql注入
// // sql语句 ? 表示占位符 占位符可以防止sql注入 
// const insertSql = 'INSERT INTO users (username,password) VALUES(?,?)'

// // 数组形式将值传进去
// db.query(insertSql,[newUser.username,newUser.password],(err,results)=>{
//     if(err) return console.log(err.message);
//     // 如果受影响的行数为1, 则插入成功
//     if(results.affectedRows === 1) console.log('插入数据成功');
// })

// const newUser = { username: new Date().toLocaleString(), password: "321654" }
// const insertSql = `INSERT INTO users SET ?`
// db.query(insertSql, newUser, (err, results) => {
//     if (err) return console.log(err.message);
//     // 如果受影响的行数为1, 则插入成功
//     if (results.affectedRows === 1) console.log('插入数据成功');
// })

// const updateSql = "UPDATE users SET password = ?, email = ?, nickname=? WHERE username = ?"
// const editedUserInfo = { email: '123@qq.com', nickname: "zsChanged", password: "321654987" }
// const modifiedUsername = 'zs'
// let { email, nickname, password } = editedUserInfo // 结构赋值
// db.query(updateSql, [password, email, nickname, modifiedUsername], (err, results) => {
//     if (err) return console.log(err.message);
//     if(results.affectedRows === 1) console.log('更新成功');
// }) 

// const updateSql = `UPDATE users SET ? WHERE username = ?`
// const editedUserInfo = { email: '123@qq.com', nickname: "zsChanged2", password: "321654987" }
// const modifiedUsername = 'zs'
// db.query(updateSql, [editedUserInfo, modifiedUsername], (err, results) => {
//     if (err) return console.log(err.message);
//     if (results.affectedRows === 1) console.log('更新成功');
// })

// const deleteSql = 'DELETE FROM users WHERE username = ? AND email = ? '
// const deleteUsername = '2022/10/26 17:53:39'
// db.query(deleteSql, [deleteUsername, '321'], (err, results) => {
//     if (err) return console.log(err.message);
//     if (results.affectedRows === 1) console.log('删除成功');
//     console.log(results);
// })
const fakeDeleteSql = `UPDATE users SET is_acitve = false WHERE username = ? AND email = ? `
const deleteUsername = '2022/10/26 17:53:39'
db.query(fakeDeleteSql, [deleteUsername, '321'], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) console.log('删除成功');
    console.log(results);
})