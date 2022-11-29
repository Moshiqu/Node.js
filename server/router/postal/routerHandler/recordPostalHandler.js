const db = require('@root/db')
const { validationResult } = require('express-validator')

const recordPostalHandler = async (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: "fail",
            msg: errArray[0].msg
        })
    }

    // TODO 限制日期, 发送日期必须大于+1, (月末, 或者一年最后一天)
    // 校验验证码
    const { uuid, verifyCode, name, mail, time, content } = req.body

    try {
        const captchaValidation = await isCaptchaValide(uuid, verifyCode, () => recordPostal({ name, mail, time, content }))
        res.send(captchaValidation)
    } catch (error) {
        return res.status(500).send(error)
    }
}

/**
 * @description: 校验验证码
 * @param {uuid} uuid
 * @param {verifyCode} 验证码
 * @param {cb} 回调函数
 * @return {*}
 */
const isCaptchaValide = (uuid, verifyCode, cb) => {
    return new Promise((resolve, reject) => {
        const captchaValideSql = 'SELECT start_time, id FROM captcha WHERE uuid= ? and text= ? and is_active = "true"'
        console.log(uuid,verifyCode);
        db.query(captchaValideSql, [uuid, verifyCode], async (err, result) => {
            if (err) {
                return reject({ status: 'fail', msg: err.message || err.sqlMessage })
            }

            result = JSON.parse(JSON.stringify(result))
            if (result.length !== 1) {
                return reject({
                    status: 'fail',
                    msg: '验证码错误'
                })
            }


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



            try {
                resolve(await cb())
            } catch (error) {
                return reject(error)
            }

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
        const updateCaptcha = "UPDATE captcha SET ? WHERE id = ? and is_active = 'true'"

        db.query(updateCaptcha, [{ is_active: "false" }, id], (err, result) => {
            if (err) return reject({ status: 'fail', msg: err.message })
            return resolve({ status: "success", msg: "修改验证码状态成功" })
        })
    })
}

/**
 * @description: 邮件保存
 * @param {name} 发信人
 * @param {mail} 发信邮箱
 * @param {time} 发信时间
 * @param {content} 邮件内容
 * @return {*}
 */
const recordPostal = ({ name, mail, time, content }) => {
    return new Promise((resolve, reject) => {
        const recordSql = "INSERT INTO postal_options SET ?"
        db.query(recordSql, { sender: name, destination_mail: mail, send_time: time, content }, (err, result) => {
            if (err) {
                return reject({ status: 'fail', msg: err.message || err.sqlMessage })
            }

            if (result.affectedRows !== 1) {
                return reject({ status: 'fail', msg: "保存记录失败" })
            }

            return resolve({ status: 'success' })
        })
    })
}


module.exports = {
    recordPostalHandler,
}