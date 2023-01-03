const db = require('@root/db')
const dayjs = require('dayjs')
const { validationResult } = require('express-validator')

const emailsListHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) return res.status(500).send({ msg: errArray[0].msg })

    const getCountSql = `SELECT COUNT(*) AS total FROM postal_options WHERE is_active = "true"`

    const { pageSize, pageNum } = req.query
    const start = (pageNum - 1) * pageSize; // 起始位置

    db.getConnection((err, conn) => {
        if (err) return res.status(500).send({ msg: "从连接池获取连接失败" })
        conn.query(getCountSql, (err, result) => {
            if (err) return res.status(402).send({ msg: err.message || err.sqlMessage })
            result = JSON.parse(JSON.stringify(result))

            const total = result[0].total

            const emialsListSql = `SELECT sender, destination_mail, send_time, content, is_send, start_time, id FROM postal_options WHERE is_active = "true" ORDER BY start_time DESC LIMIT ${pageSize} offset ${start}`
            conn.query(emialsListSql, (err, result) => {
                if (err) return res.status(402).send({ msg: err.message || err.sqlMessage })

                result = JSON.parse(JSON.stringify(result))
                const starArr = result.map(item => {
                    const { sender, destination_mail, start_time, send_time, is_send, id } = item
                    const [address, suffix] = destination_mail.split("@")

                    return {
                        sender: sender[0] + makeStar(sender.length - 1),
                        destination_mail: address.slice(0, 2) + makeStar(address.length - 2) + suffix,
                        start_time: dayjs(start_time).format('YYYY-MM-DD HH:mm:ss'),
                        send_time: dayjs(send_time).format('YYYY-MM-DD HH:mm:ss'),
                        status: is_send === 'true',
                        key: id
                    }
                })
                return res.send({
                    data: starArr,
                    pagination: { pageNum: parseInt(pageNum), total: total, pageSize: parseInt(pageSize) }
                })
            })
        })
        db.releaseConnection(conn)
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
    emailsListHandler,
}