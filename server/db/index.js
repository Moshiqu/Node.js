const mysql = require('mysql')

const db = mysql.createPool({
    user: "root",
    password: "123456",
    database: "test"
})

module.exports = db