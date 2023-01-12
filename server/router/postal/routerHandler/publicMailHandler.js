const db = require('@root/db')
const dayjs = require('dayjs')
const { validationResult } = require('express-validator')

const publicMailHandler = async (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: "fail",
            msg: errArray[0].msg
        })
    }

    const { pageNum, pageSize, type } = req.query
    try {
        res.send(await getPublicEmails(pageNum, pageSize, parseInt(type)))
    } catch (error) {
        res.status(500).send(error)
    }
}

/**
 * @description: 获取数据
 * @param {pageNum} 页码
 * @param {pageSize} 每页条数
 * @param {type} 类型 1:最新公开信,2:最新评论,3:最多评论 
 * @return {*}
 */
const getPublicEmails = (pageNum, pageSize, type) => {
    return new Promise(async (resolve, reject) => {
        const start = (pageNum - 1) * pageSize; // 起始位置
        let getPublicEmailsSql = ''
        const getCountSql = `SELECT COUNT(*) AS total FROM postal_options WHERE is_active = "true" and is_open = "true"`

        let result = null
        switch (type) {
            case 1:
                getPublicEmailsSql = `SELECT sender, destination_mail, send_time, content, is_send, start_time, id  FROM postal_options WHERE is_active = "true" and is_open = "true" ORDER BY start_time DESC LIMIT ${pageSize} offset ${start}`
                break;
            case 2:
                getPublicEmailsSql = `SELECT postal_id, count(1) AS account FROM postal_comments WHERE is_active = "true" GROUP BY postal_id`
                break;
            case 3:
                getPublicEmailsSql = `SELECT postal_id, count(1) AS account FROM postal_comments WHERE is_active = "true" GROUP BY postal_id`
                break;

            default:
                break;
        }

        try {
            if (type === 1) {
                result = await latestTypeEmail(getCountSql, getPublicEmailsSql, pageNum, pageSize)
            } else if (type === 2) {
                // result = await latestTypeEmail(getCountSql, getPublicEmailsSql, pageNum, pageSize)
            } else if (type === 3) {
                result = await mostTypeEmail(getCountSql, getPublicEmailsSql, pageNum, pageSize)
            }
            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}

/**
 * @description: 最新公开信查询
 * @param {getCountSql} 总数
 * @param {getPublicEmailsSql} sql
 * @param {pageNum} pageNum
 * @param {pageSize} pageSize
 * @return 
 */
const latestTypeEmail = (getCountSql, getPublicEmailsSql, pageNum, pageSize) => {
    return new Promise((resolve, reject) => {
        db.query(getCountSql, (err, result) => {
            if (err) return reject({ status: "fail", msg: err.message || err.sqlMessage })
            const total = result[0].total

            db.query(getPublicEmailsSql, (err, result1) => {
                if (err) return reject({ status: "fail", msg: err.message || err.sqlMessage })

                const list = JSON.parse(JSON.stringify(result1))

                list.forEach(item => {
                    const { sender, destination_mail, send_time, is_open, start_time, content } = item
                    item.sender = sender[0] + makeStar(sender.length - 1)

                    const [address, suffix] = destination_mail.split("@")
                    item.destination_mail = address.slice(0, 2) + makeStar(address.length - 2) + suffix

                    item.send_time = dayjs(send_time).format('YYYY-MM-DD HH:mm:ss')

                    item.start_time = dayjs(start_time).format('YYYY-MM-DD HH:mm:ss')

                    item.is_open = is_open === 'true' || is_open === true

                    item.content = content.replace(`<link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.7/quill.snow.css" rel="stylesheet">`, '')
                })
                resolve({ status: 'success', data: list, pagination: { pageNum: parseInt(pageNum), total: total, pageSize: parseInt(pageSize) } })
            })
        })
    })
}

const mostTypeEmail = (getCountSql, getPublicEmailsSql, pageNum, pageSize) => {
    return new Promise((resolve, reject) => {
        db.query(getCountSql, (err, result) => {
            if (err) return reject({ status: "fail", msg: err.message || err.sqlMessage })
            const total = result[0].total

            db.query(getPublicEmailsSql, (err, result1) => {
                if (err) return reject({ status: "fail", msg: err.message || err.sqlMessage })

                const list = JSON.parse(JSON.stringify(result1))

                list.forEach(item => {
                    const { sender, destination_mail, send_time, is_open, start_time, content } = item
                    item.sender = sender[0] + makeStar(sender.length - 1)

                    const [address, suffix] = destination_mail.split("@")
                    item.destination_mail = address.slice(0, 2) + makeStar(address.length - 2) + suffix

                    item.send_time = dayjs(send_time).format('YYYY-MM-DD HH:mm:ss')

                    item.start_time = dayjs(start_time).format('YYYY-MM-DD HH:mm:ss')

                    item.is_open = is_open === 'true' || is_open === true

                    item.content = content.replace(`<link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.7/quill.snow.css" rel="stylesheet">`, '')
                })
                resolve({ status: 'success', data: list, pagination: { pageNum: parseInt(pageNum), total: total, pageSize: parseInt(pageSize) } })
            })
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
    publicMailHandler,
}