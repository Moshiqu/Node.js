const mysql = require('mysql')

const db = mysql.createPool({
    user: "root",
    // password: "admin",
    password: "admin",
    database: "what_is_that_website"
    // database:"test"
})

module.exports = db