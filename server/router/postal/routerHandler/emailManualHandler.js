const db = require('@root/db')
const { validationResult } = require('express-validator')

const emailManualHandler = async (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: "fail",
            msg: errArray[0].msg
        })
    }

    try {
        const { email_key } = req.body
        res.send(await getEmailInfo(email_key))
    } catch (error) {
        res.status(500).send(error)
    }
}

/**
 * @description: 拿取邮件信息
 * @param {email_key} 提取码
 * @return {*}
 */
const getEmailInfo = (email_key) => {
    return new Promise((resolve, reject) => {
        const getEmailInfoSql = "SELECT sender, start_time, send_time, mail_key, destination_mail, content FROM postal_options WHERE mail_key = ? AND is_active = 'true'"

        db.query(getEmailInfoSql, email_key, async (err, res) => {
            if (err) {
                return reject({ status: 'fail', msg: err.message || err.sqlMessage })
            }

            let result = JSON.parse(JSON.stringify(res))
            if (result.length !== 1) {
                return reject({ status: "fail", msg: "未查询到该邮件信息" })
            }

            result = result[0]
            const { is_send } = result
            if (is_send) {
                return reject({ status: "fail", msg: "该邮件已经发送过了" })
            }

            try {
                resolve(await updateEmail(result))
            } catch (error) {
                reject(error)
            }
        })
    })
}

/**
 * @description: 手动发送邮件
 * @param {emailInfo} 邮件信息
 * @return {*}
 */
const sendMail = (emailInfo) => {
    return new Promise((resolve, reject) => {
        // 发送邮件
        const emailUtil = require("@root/utils/sendMail")
        const configObj = require("@root/config")
        const { sender, send_time, destination_mail, content, start_time } = emailInfo
        const dayjs = require("dayjs")
        // 发送邮件配置对象
        const emailSendOption = {
            subject: `${sender} From ${dayjs(start_time).format('YYYY-MM-DD HH:mm:ss')}`, // 标题
            text: 'Hello world?', // 文本内容?
            html: `${content}<br><a href="http://${configObj.clientAddress}:${configObj.clientPort}/">点击跳转</a>`, //页面内容
        }

        emailUtil.sendMail(destination_mail, emailSendOption, (state, response) => {
            if (state) {
                resolve({ status: "success", msg: `邮件发送成功, 收信箱为 ${response.accepted[0]}` })
            } else {
                reject({ status: "fail", msg: response })
            }
        })
    })
}

/**
 * @description: 更新邮件状态
 * @param {emailInfo} 邮件信息
 * @return {*}
 */
const updateEmail = (emailInfo) => {
    return new Promise((resolve, reject) => {
        // 发送邮件
        const updateEmailSql = `UPDATE postal_options SET ? WHERE mail_key = ? and is_active = 'true' and is_send = 'false'`
        const { mail_key } = emailInfo
        db.query(updateEmailSql, [{ is_send: true }, mail_key], async (err, result) => {
            if (err) return reject({ status: 'fail', msg: err.message || err.sqlMessage })

            if (result.affectedRows !== 1) {
                return reject({ status: 'fail', msg: "未找到该邮件信息" })
            }

            try {
                resolve(await sendMail(emailInfo))
            } catch (error) {
                reject(error)
            }
        })
    })
}


module.exports = {
    emailManualHandler,
}