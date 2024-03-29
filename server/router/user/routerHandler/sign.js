const db = require('@root/db')
const { validationResult } = require('express-validator')

const reguserHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        // 未通过验证
        return res.status(500).send({
            status: 'fail',
            msg: errArray[0].msg
        })
    }

    // 通过验证
    const { password, repassword, account, email, captcha, uuid } = req.body
    isCaptchaValidated(captcha, uuid)
        .then(result => {
            if (result.status === 'success') {
                if (password === repassword) {
                    Promise.all([isAccountExisted(account), isEmailExisted(email)])
                        .then(async (result) => {
                            try {
                                const insertResult = await insertUser(req.body)
                                return res.send(insertResult)
                            } catch (error) {
                                return res.status(500).send(error)
                            }
                        }).catch(err => {
                            return res.status(500).send(err)
                        })
                } else {
                    return res.status(500).send({
                        status: 'fail',
                        msg: '两次密码输入不一致'
                    })
                }
            }
        }).catch(err => {
            return res.status(500).send(err)
        })
}

const loginHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length && errArray[0].nestedErrors) {
        res.status(500).send({
            status: 'fail',
            msg: '未输入账号或邮箱'
        })
    } else if (errArray.length) {
        res.status(500).send({
            status: 'fail',
            msg: errArray[0].msg
        })
    } else {
        const { account, email, password } = req.body
        const { RegEmail, RegAccount } = require('@root/config')
        if (account && !RegAccount.test(account)) {
            return res.status(500).send({
                status: 'fail',
                msg: '账号格式错误'
            })
        }

        if (email && !RegEmail.test(email)) {
            return res.status(500).send({
                status: 'fail',
                msg: '邮箱格式错误'
            })
        }

        checkPassword({ account, email, password })
            .then(result => {
                res.send(result)
            }).catch(err => {
                res.status(500).send(err)
            })
    }
}

const captchaHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: 'fail',
            msg: errArray[0].msg
        })
    }
    const { uuid } = req.query
    const svgCaptcha = require('svg-captcha')
    const { captchaOption } = require('@root/config')
    const captcha = svgCaptcha.create(captchaOption) //字母和数字随机验证码
    // let captcha = svgCaptcha.createMathExpr(options) //数字算数随机验证码

    // text是指产生的验证码，data指svg的字节流信息
    const { text, data } = captcha

    insertCaptcha(text, uuid)
        .then(result => {
            res.send({ status: 'success', data: { img: data, str: text } })
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

/**
 * @description: 数据库中是否已存在当前账号
 * @param {*} account
 * @return {*}
 */
const isAccountExisted = (account) => {
    return new Promise((resolve, reject) => {
        const selectAccountSql = `SELECT 1 FROM users WHERE account = ? and is_active = 'true' LIMIT 1`
        db.query(selectAccountSql, [account], (err, result) => {
            if (err) {
                return reject({
                    status: 'fail',
                    msg: err.message || err.sqlMessage
                })
            } else {
                if (!result.length) {
                    return resolve({
                        status: 'success',
                        msg: '当前账号可用'
                    })
                }
                return reject({
                    status: 'fail',
                    msg: '当前账号已存在'
                })
            }
        })
    })
}
/**
 * @description: 数据库中是否已存在当前邮箱
 * @param {*} email
 * @return {*}
 */
const isEmailExisted = (email) => {
    return new Promise((resolve, reject) => {
        const selectAccountSql = `SELECT 1 FROM users WHERE email = ? LIMIT 1`
        db.query(selectAccountSql, [email], (err, result) => {
            if (err) {
                return reject({
                    status: 'fail',
                    msg: err.message || err.sqlMessage
                })
            } else {
                if (!result.length) {
                    return resolve({
                        status: 'success',
                        msg: '当前邮箱可用'
                    })
                }
                return reject({
                    status: 'fail',
                    msg: '当前邮箱已存在'
                })
            }
        })
    })
}

/**
 * @description: 数据库中插入新用户
 * @param {password,account,email} 
 * @return {*}
 */
const insertUser = (userInfo) => {
    return new Promise((resolve, reject) => {
        const { password, account, email } = userInfo
        const insertSql = 'INSERT INTO users SET ?'

        // 使用bcrypt加密密码
        const bcrypt = require('bcrypt')
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject({
                        status: 'fail',
                        msg: '密码加密出错'
                    })
                } else {
                    // 插入数据库
                    const newUserData = { password: hash, account, email }
                    db.query(insertSql, newUserData, (err, result) => {
                        if (err) {
                            return reject({
                                status: 'fail',
                                msg: err.message || err.sqlMessage
                            })
                        }
                        if (result.affectedRows === 1) {
                            return resolve({
                                status: "success"
                            })
                        }
                        return reject({
                            status: "fail",
                            msg: "新增用户出错"
                        })
                    })
                }
            });
        });


    })
}
/**
 * @description: 检查密码并且返回token
 * @param {account, password, email} userInfo
 * @return {token}
 */
const checkPassword = (userInfo) => {
    return new Promise((resolve, reject) => {
        const { account, password, email } = userInfo
        let getUserInfoSql = ''
        if (account) {
            getUserInfoSql = 'SELECT account, email, avatar, nickname, password FROM  users WHERE account = ? and is_active = "true"'
        } else {
            getUserInfoSql = 'SELECT account, email, avatar, nickname, password FROM  users WHERE email = ? and is_active = "true"'
        }

        db.query(getUserInfoSql, account ? account : email, (err, result) => {
            if (err) {
                return reject({
                    status: 'fail',
                    msg: err.message || err.sqlMessage
                })
            }
            if (result.length !== 1) {
                return reject({
                    status: 'fail',
                    msg: '用户名或邮箱无效'
                })
            }
            result = JSON.parse(JSON.stringify(result))
            const { account, email, avatar, nickname, password: hash } = result[0]

            const bcrypt = require('bcrypt')
            const comparison = bcrypt.compareSync(password, hash)

            if (!comparison) {
                return reject({
                    status: 'fail',
                    msg: '密码错误'
                })
            }

            const jwt = require('jsonwebtoken')
            const { TokenSecretKey, TokenOptions } = require('@root/config')

            resolve({
                status: 'success',
                token: jwt.sign({ account, email, avatar, nickname }, TokenSecretKey, TokenOptions)
            })
        })

    })
}

/**
 * @description: 
 * @param {用户名} account
 * @param {验证码结果} text
 * @param {uuid} uuid
 * @return {*}
 */
const insertCaptcha = (text, uuid) => {
    return new Promise((resolve, reject) => {
        const insertCaptchaSql = 'INSERT INTO captcha SET ?'
        const data = { text, uuid }
        db.query(insertCaptchaSql, data, (err, result) => {
            if (err) {
                return reject({ status: 'fail', msg: err.message || err.sqlMessage })
            }
            if (result.affectedRows === 1) {
                return resolve({
                    status: "success"
                })
            }
            return reject({
                status: "fail",
                msg: "添加验证码出错"
            })
        })
    })
}

/**
 * @description: 校验验证码结果
 * @param {uuid } uuid
 * @param {验证码} captcha
 * @return {验证码验证结果}
 */
const isCaptchaValidated = (captcha, uuid) => {
    return new Promise((resolve, reject) => {
        const captchaValidateSql = "SELECT text, start_time FROM captcha WHERE uuid = ? and is_active = 'true'"
        db.query(captchaValidateSql, uuid, async (err, result) => {
            if (err) {
                return reject({
                    status: 'fail',
                    msg: err.message || err.sqlMessage
                })
            }

            try {
                await cancelCaptcha(uuid)
            } catch (error) {
                return reject({
                    status: 'fail',
                    msg: error.msg
                })
            }

            result = JSON.parse(JSON.stringify(result))

            if (result.length === 0) {
                return reject({
                    status: 'fail',
                    msg: '请先获取验证码'
                })
            } else if (result.length > 1) {
                return reject({
                    status: 'fail',
                    msg: '验证码失效,请重新获取'
                })
            }

            const { text: resultText, start_time } = result[0]

            const currentStamp = new Date().getTime()
            const { ExpiredVlideTime } = require('@root/config')
            const expiredStamp = new Date(start_time).getTime() + (ExpiredVlideTime * 60 * 1000)

            if (currentStamp > expiredStamp) {
                return reject({
                    status: 'fail',
                    msg: "验证码已过期,请重新获取"
                })
            }

            if (captcha.toLowerCase() !== resultText.toLowerCase()) {
                return reject({
                    status: 'fail',
                    msg: '验证码错误'
                })
            }

            return resolve({
                status: "success"
            })
        })
    })
}

/**
 * @description: 将验证码删除(伪删除)
 * @param { uuid } uuid
 * @return { 删除结果 }
 */
const cancelCaptcha = (uuid) => {
    return new Promise((resolve, reject) => {
        const updateCaptcha = "UPDATE captcha SET ? WHERE uuid = ? and is_active = 'true'"

        db.query(updateCaptcha, [{ is_active: "false" }, uuid], (err, result) => {
            if (err) return reject({ status: 'fail', msg: err.message })
            return resolve({ status: "success", msg: "修改验证码状态成功" })
        })
    })
}

module.exports = {
    reguserHandler,
    loginHandler,
    captchaHandler
}