const mysql = require('mysql')

const db = mysql.createPool({
    user: "root",
    password: "admin123",
    // password: "123456",
    database: "test"
})

module.exports = db