const db = require('@root/db')
const { validationResult } = require('express-validator')

const searchEmailHandler = async (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: "fail",
            msg: errArray[0].msg
        })
    }

    const { name, verification, emailAddress, uuid } = req.query

    try {
        await isCaptchaValide(verification, uuid)
        return res.send(await searchEmail(name, emailAddress))
    } catch (error) {
        return res.status(402).send(error)
    }
}

/**
 * @description: 校验验证码
 * @param {uuid} uuid
 * @param {verification_code} 验证码
 * @return {*}
 */
const isCaptchaValide = (verification_code, uuid) => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, conn) => {
            if (err) return reject({ msg: "从连接池获取连接失败" })
            const isCaptchaValideSql = `SELECT start_time, id FROM captcha WHERE uuid= ? and text= ? and is_active = "true"`
            conn.query(isCaptchaValideSql, [uuid, verification_code], (err, result) => {
                if (err) return reject({ msg: err.message || err.sqlMessage })

                result = JSON.parse(JSON.stringify(result))
                if (result.length !== 1) return reject({ msg: '验证码错误' })

                const { id, start_time } = result[0]
                deleteCode(id)

                const currentStamp = new Date().getTime()
                const { ExpiredVlideTime } = require('@root/config')
                const expiredStamp = new Date(start_time).getTime() + (ExpiredVlideTime * 60 * 1000)

                if (currentStamp > expiredStamp) {
                    return reject({
                        status: 'fail',
                        msg: "验证码已过期,请重新获取"
                    })
                }

                return resolve(true)
            })

            db.releaseConnection(conn)
        })
    })
}

/**
 * @description: 删除验证码
 * @param {id} id
 * @return {*}
 */
const deleteCode = (id) => {
    return new Promise((resolve, reject) => {
        const updateCaptchaSql = "UPDATE captcha SET ? WHERE id = ? and is_active = 'true'"

        db.getConnection((err, conne) => {
            if (err) return reject({ status: "fail", msg: "从连接池获取连接失败" })
            conne.query(updateCaptchaSql, [{ is_active: "false" }, id], (err, result) => {
                if (err) return reject({ status: 'fail', msg: err.message })
                return resolve({ status: "success", msg: "修改验证码状态成功" })
            })
            db.releaseConnection(conne)
        })
    })
}

/**
 * @description: 查找邮件 
 * @param {name} 名称
 * @param {email} 邮件地址 
 * @return {*}
 */
const searchEmail = (name, email) => {
    const searchEmailSql = `SELECT * FROM postal_options WHERE sender= ? and destination_mail= ?`
    return new Promise((resolve, reject) => {
        db.getConnection((err, conn) => {
            if (err) return reject({ status: "fail", msg: "从连接池获取连接失败" })
            conn.query(searchEmailSql, [name, email], (err, result) => {
                if (err) return reject({ status: 'fail', msg: err.message })

                result = JSON.parse(JSON.stringify(result))

                if (!result.length) return resolve({ msg: '未查询到邮件信息', emailsList: result })
                return resolve({ emailsList: result })
            })
            db.releaseConnection(conn)
        })
    })
}

module.exports = {
    searchEmailHandler,
}