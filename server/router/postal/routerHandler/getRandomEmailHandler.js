const db = require('@root/db')

const getRandomEmailHandler = (req, res) => {
    db.getConnection((err, conn) => {
        if (err) return res.status(402).send({ msg: "从连接池获取连接失败" })
        const getRandomEmailSql = `SELECT * FROM postal_options AS t1 JOIN (SELECT ROUND(RAND() * ((SELECT MAX(id) FROM postal_options)-(SELECT MIN(id) FROM postal_options))+(SELECT MIN(id) FROM postal_options)) AS id) AS t2 WHERE t1.id >= t2.id AND is_active = 'true' ORDER BY t1.id LIMIT 1;`
        conn.query(getRandomEmailSql, (err, result) => {
            if (err) return res.status(402).send({ msg: err.message || err.sqlMessage })

            result = JSON.parse(JSON.stringify(result))
            if (result.length !== 1) return res.status(402).send({ msg: "获取随机邮件失败" })

            return res.send({ id: result[0].id, msg: "获取邮件id成功" })
        })

        db.releaseConnection(conn)
    })
}

/**
 * @description: 获取所有邮件id
 * @param {pageNum} 页码
 * @param {pageSize} 每页条数
 * @param {type} 类型 1:最新公开信,最新评论,最多评论 
 * @return {*}
 */

module.exports = {
    getRandomEmailHandler,
}