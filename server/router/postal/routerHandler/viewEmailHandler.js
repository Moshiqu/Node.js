const db = require('@root/db')

const viewEmailHandler = async (req, res) => {
    const { email_id } = req.query

    try {
        res.send(await getEmailInfo(email_id))
    } catch (error) {
        res.status(500).send(error)
    }
}

/**
 * @description: 拿取邮件信息
 * @param {email_id} 邮件id
 * @return {*}
 */
const getEmailInfo = (email_id) => {
    return new Promise((resolve, reject) => {
        const getEmailInfoSql = `SELECT sender, destination_mail, send_time, start_time, is_send,content FROM postal_options WHERE id = ? and is_active = 'true'`
        db.query(getEmailInfoSql, email_id, (err, result) => {
            if (err) return reject({ status: "fail", msg: err.message || err.sqlMessage })

            result = JSON.parse(JSON.stringify(result))

            if (!result.length) return reject({ status: "fail", msg: "未查询到该邮件信息" })

            const [emailInfo] = result
            const { sender, destination_mail, send_time, is_open, start_time, content } = emailInfo
            emailInfo.is_open = is_open === 'true' ? true : false
            emailInfo.sender = sender[0] + makeStar(sender.length - 1)

            const [address, suffix] = destination_mail.split("@")
            emailInfo.destination_mail = address.slice(0, 2) + makeStar(address.length - 2) + suffix

            const dayjs = require("dayjs")
            emailInfo.send_time = dayjs(send_time).format('YYYY-MM-DD HH:mm:ss')

            emailInfo.start_time = dayjs(start_time).format('YYYY-MM-DD HH:mm:ss')

            emailInfo.content = content.replace(`<link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.7/quill.snow.css" rel="stylesheet">`, '')

            resolve({ status: "success", data: { email_info: emailInfo } })
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
    viewEmailHandler,
}