const mysql = require('mysql')

const db = mysql.createPool({
    user: "root",
    // password: "admin123",
    password: "123456",
    // database: "what_is_that_website"
    database:"test"
})

module.exports = db