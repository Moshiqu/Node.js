const db = require('@root/db')

const emailInfoHandler = async (req, res) => {
    const { key } = req.body
    if (!key) {
        return res.send({ status: "success", msg: "未传入key值", data: {} })
    }

    try {
        res.send(await getEmailInfo(key))
    } catch (error) {
        res.status(500).send(error)
    }
}

/**
 * @description: 拿取邮件信息
 * @param {key} key
 * @return {*}
 */
const getEmailInfo = (mail_key) => {
    return new Promise((resolve, reject) => {
        const getEmailInfoSql = "SELECT start_time, send_time, destination_mail, content FROM postal_options WHERE mail_key = ? AND is_active = 'true' AND is_send = 'false'"

        db.query(getEmailInfoSql, mail_key, (err, res) => {
            if (err) {
                return reject({ status: 'fail', msg: err.message || err.sqlMessage })
            }

            const result = JSON.parse(JSON.stringify(res))

            if (result.length !== 1) {
                return reject({ status: "fail", msg: "未查询到该邮件信息" })
            }

            const { start_time, send_time, destination_mail, content } = result[0]

            const currentStamp = new Date().getTime()
            const startStamp = new Date(start_time).getTime()
            const expiredStamp = startStamp + 100 * 1000
            // if (currentStamp > expiredStamp) {
            //     return resolve({ status: "success", msg: "100秒有效期已过", data: {} })
            // }

            return resolve({
                status: "success", msg: "", data: {
                    start_time,
                    send_time,
                    destination_mail,
                    content,
                    mail_key
                }
            })
        })
    })
}


module.exports = {
    emailInfoHandler,
}