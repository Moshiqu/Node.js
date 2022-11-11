const db = require('../../../db')
const { validationResult } = require('express-validator')
const { text } = require('express')

const reguserHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        // 未通过验证
        res.send({
            status: 'fail',
            msg: errArray[0].msg
        })
    } else {
        // 通过验证
        const { password, repassword, account, email, captcha } = req.body
        if (password === repassword) {
            Promise.all([isAccountExisted(account), isEmailExisted(email), isCaptchaValidated(account, captcha)])
                .then(async (result) => {
                    try {
                        const insertResult = await insertUser(req.body)
                        res.send(insertResult)
                    } catch (error) {
                        res.send(error)
                    }
                }).catch(err => {
                    res.send(err)
                })
        } else {
            res.send({
                status: 'fail',
                msg: '两次密码输入不一致'
            })
        }
    }

}

const loginHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length && errArray[0].nestedErrors) {
        res.send({
            status: 'fail',
            msg: '未输入账号或邮箱'
        })
    } else if (errArray.length) {
        res.send({
            status: 'fail',
            msg: errArray[0].msg
        })
    } else {
        const { account, email, password } = req.body
        const { RegEmail, RegAccount } = require('../../../../config')
        if (account && !RegAccount.test(account)) {
            return res.send({
                status: 'fail',
                msg: '账号格式错误'
            })
        }

        if (email && !RegEmail.test(email)) {
            return res.send({
                status: 'fail',
                msg: '邮箱格式错误'
            })
        }

        checkPassword({ account, email, password })
            .then(result => {
                res.send(result)
            }).catch(err => {
                res.send(err)
            })
    }
}

const captchaHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.send({
            status: 'fail',
            msg: errArray[0].msg
        })
    }
    const { account } = req.body
    const svgCaptcha = require('svg-captcha')
    const { captchaOption } = require('../../../../config')
    const captcha = svgCaptcha.create(captchaOption) //字母和数字随机验证码
    // let captcha = svgCaptcha.createMathExpr(options) //数字算数随机验证码

    // text是指产生的验证码，data指svg的字节流信息
    const { text, data } = captcha

    insertCaptcha(account, text)
    res.send({ status: 'success', data: { img: data, str: text } })
}

/**
 * @description: 数据库中是否已存在当前账号
 * @param {*} account
 * @return {*}
 */
const isAccountExisted = (account) => {
    return new Promise((resolve, reject) => {
        const selectAccountSql = `SELECT 1 FROM users WHERE account = ? LIMIT 1`
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
            getUserInfoSql = 'SELECT account, email, avatar, nickname, password FROM  users WHERE account = ?'
        } else {
            getUserInfoSql = 'SELECT account, email, avatar, nickname, password FROM  users WHERE email = ?'
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
            const { TokenSecretKey } = require('../../../../config')

            resolve({
                status: 'success',
                token: jwt.sign({ account, email, avatar, nickname }, TokenSecretKey, { expiresIn: '5d' })
            })
        })

    })
}

/**
 * @description: 
 * @param {用户名} account
 * @param {验证码结果} text
 * @return {*}
 */
const insertCaptcha = (account, text) => {
    return new Promise((resolve, reject) => {
        const insertCaptchaSql = 'INSERT INTO captcha SET ?'
        const data = { account, text }
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

const isCaptchaValidated = (account, captcha) => {
    return new Promise((resolve, reject) => {
        const captchaValidateSql = "SELECT text,start_time from captcha where account = ? and is_active = 'true'"
        db.query(captchaValidateSql, account, (err, result) => {
            if (err) {
                return reject({
                    status: 'fail',
                    msg: err.message || err.sqlMessage
                })
            }
            console.log(result);
            if (result.length !== 1) {
                return reject({
                    status: 'fail',
                    msg: '验证码错误'
                })
            }

            result = JSON.parse(JSON.stringify(result))
            const { text: resultText } = result[0]
            if (captcha !== resultText) {
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


module.exports = {
    reguserHandler,
    loginHandler,
    captchaHandler
}