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
        const total = await getRepliesCount(email_id)
        const resultArr = await getReplies(email_id, pageNum, pageSize)
        const pagination = { total, pageNum: parseInt(pageNum), pageSize: parseInt(pageSize) }
        return res.send({ data: resultArr, pagination })
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
const getReplies = (email_id, pageNum, pageSize) => {
    // 起始位置
    const startPosition = (pageNum - 1) * pageSize
    const getRepliesSql = `SELECT id, comment_content as content, comment_nickname as nickname, comment_mail_address as email, start_time as time FROM postal_comments WHERE postal_id = ${email_id} and is_active = 'true' ORDER BY start_time DESC LIMIT ${pageSize} OFFSET ${startPosition}`

    return new Promise((resolve, reject) => {
        db.getConnection((err, conn) => {
            if (err) return reject('从连接池获取连接失败')

            conn.query(getRepliesSql, (err, res) => {
                if (err) return reject({ msg: err.message || err.sqlMessage })

                const result = JSON.parse(JSON.stringify(res))

                // 处理日期格式 && 邮箱加密
                result.forEach(item => {
                    const { time, email } = item

                    if (time) item.time = dayjs(time).format("YYYY-MM-DD HH:mm:ss")


                    if (email) {
                        const [address, suffix] = email.split("@")
                        item.email = address.slice(0, 2) + makeStar(address.length - 2) + '@' +suffix
                    }

                });

                return resolve(result)
            })

            db.releaseConnection(conn)
        })
    })

}

/**
 * @description: 获取所有评论数
 * @param {email_id} 邮件id 
 * @return {*}
 */
const getRepliesCount = (email_id) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, conn) => {
            if (err) return reject('从连接池获取连接失败')
            const getRepliesCountSql = `SELECT COUNT(*) AS total FROM postal_comments WHERE postal_id = ${email_id} AND is_active = 'true'`
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

/**
 * @description: 生成数量的*号
 * @param {num} 需要的数量
 * @return {star} 相当数量的* 字符串
 */
const makeStar = (num) => {
    if (num === 0) return ""
    if (num > 10) return "**********"

    let star = ""
    for (let index = 0; index < num; index++) {
        star += '*'
    }
    return star
}

module.exports = {
    repliesHandler,
}