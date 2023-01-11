const db = require('@root/db')
const dayjs = require('dayjs')
const { validationResult } = require('express-validator')

const repliesHandler = async (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: "fail",
            msg: errArray[0].msg
        })
    }

    const { pageNum, pageSize, email_id } = req.query

    try {
        const total = await getRepliesCount()
        return res.send({total})
        // const listObj = await getReplies(email_id, pageNum, pageSize)
    } catch (error) {
        return res.status(500).send(error)
    }
}

/**
 * @description: 根据id获取评论列表
 * @param {email_id} 邮件id 
 * @param {pageNum} 页码
 * @param {pageSize} 每页条数
 * @return {*}
 */
// const getReplies = (email_id, pageNum, pageSize) => {
//     const getRepliesSql = ``

// }

/**
 * @description: 获取所有评论数
 * @return {*}
 */
const getRepliesCount = () => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, conn) => {
            if (err) return reject('从连接池获取连接失败')
            const getRepliesCountSql = `SELECT COUNT(*) AS total FROM postal_comments WHERE is_active = 'true'`
            conn.query(getRepliesCountSql, (err, res) => {
                if (err) return reject({ msg: err.message || err.sqlMessage })
                const result = JSON.parse(JSON.stringify(res))
                const total = result[0].total
                return resolve(total)
            })

            db.releaseConnection(conn)
        })
    })
}

module.exports = {
    repliesHandler,
}