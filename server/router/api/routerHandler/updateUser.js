const db = require('@root/db')
const { validationResult } = require('express-validator')

const userUpdateHandler = (req, res) => {
    const { account } = req.auth
    const { avatar, nickname } = req.body

    if (!avatar && !nickname) {
        return res.status(500).send({ status: "fail", msg: "还未修改个人信息" })
    }

    let httpAvatar = avatar
    if (avatar) {
        httpAvatar = avatar.indexOf('http') < 0 ? `http://${avatar}` : avatar
    }

    const { RegNickname } = require('@root/config')
    if (nickname && !RegNickname.test(nickname)) {
        return res.status(500).send({ status: "fail", msg: "昵称格式错误" })
    }

    updateUser(account, httpAvatar, nickname)
        .then(result => {
            res.send(result)
        }).catch(err => {
            res.status(500).send(err)
        })
}

const userInfoHandler = (req, res) => {
    const { account } = req.auth

    getUserInfo(account)
        .then(result => {
            res.send(result)
        }).catch(err => {
            res.status(500).send(err)
        })
}

const pswChangeHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: "fail",
            msg: errArray[0].msg
        })
    }

    const { account } = req.auth
    const { originPassword, password } = req.body

    if (originPassword === password) {
        return res.status(500).send({
            status: 'fail',
            msg: "新密码和原密码不能相同"
        })
    }

    checkPassword({ account, originPassword, password })
        .then(async result => {
            try {
                const updateResult = await updatePwd(account, password)
                return res.send(updateResult)
            } catch (error) {
                return res.status(500).send(error)
            }
        }).catch(err => {
            return res.status(500).send(err)
        })
}

const imageUploadHandler = (req, res) => {
    const { path: filePath, originalname: fileName } = req.file

    if (!filePath) {
        return res.status(500).send({
            status: 'fail',
            msg: "头像上传失败",
        })
    }

    const { serverAddress: address, serverPort: port } = require('@root/config')
    return res.send({
        status: 'success',
        msg: '头像上传成功',
        imgUrl: `http://${address}:${port}/avatar/${fileName}`,
    })

}

const emailHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: "fail",
            msg: errArray[0].msg
        })
    }

    const { email: mail } = req.body
    const { account } = req.auth

    const code = parseInt(Math.random(0, 1) * 10000) //生成随机验证码
    // 发送邮件
    const emailUtil = require("@root/utils/sendMail")
    const configObj = require("@root/config")
    // 发送邮件配置对象
    const emailSendOption = {
        from: `"这是个啥开发者" <912323520@qq.com>`, // 发送方
        subject: '这是个啥验证码', // 标题
        text: 'Hello world?', // 文本内容?
        html: `<p>这里是"这是个啥", 您的验证码为${code}:</p><a href="http://${configObj.clientAddress}:${configObj.clientPort}/">点击跳转</a>`, //页面内容
    }

    emailUtil.sendMail(mail, emailSendOption, (state, response) => {
        if (state) {
            recordEmail(account, emailSendOption.html, code).then(result => {
                return res.send({
                    status: "success",
                })
            }).catch(err => {
                return res.status(500).send({
                    status: "fail",
                    msg: err.msg
                })
            })
        } else {
            return res.status(500).send({
                status: "fail",
                msg: '发送邮件失败',
                reason: response
            })
        }
    })
}

/**
 * @description: 邮件保存
 * @param {账号} account
 * @param {邮件内容} html
 * @param {验证码} code
 * @return {*}
 */

const recordEmail = (account, html, code) => {
    return new Promise((resolve, reject) => {
        let recordEmailSql = 'INSERT INTO mail SET ?'
        db.query(recordEmailSql, { account, content: html, code }, (err, result) => {
            if (err) {
                return reject({
                    status: "fail",
                    msg: err.message
                })
            }
            if (result.affectedRows === 1) {
                return resolve({
                    status: "success"
                })
            }
            return reject({
                status: "fail",
                msg: "记录验证码失败"
            })
        })

    })
}

/**
 * @description: 修改头像 昵称
 * @param {账号} account
 * @param {头像地址} avatar
 * @param {昵称} nickname
 * @return {*}
 */
const updateUser = (account, avatar, nickname) => {
    return new Promise((resolve, reject) => {
        let updateUserSql = 'UPDATE users SET ? WHERE account = ?'
        db.query(updateUserSql, [{ avatar, nickname }, account], (err, result) => {
            if (err) return reject({ status: 'fail', msg: err.message || err.sqlMessage })
            if (result.affectedRows !== 1) return reject({ status: "fail", msg: "更新用户信息失败" })
            resolve({ status: 'success' })
        })
    })
}

/**
 * @description: 获取用户信息
 * @param {账号} account
 * @return {*}
 */
const getUserInfo = (account) => {
    return new Promise((resolve, reject) => {
        const getUserInfoSql = `SELECT account, email, avatar, nickname FROM users WHERE account = ? AND is_active = 'true'`
        db.query(getUserInfoSql, account, (err, result) => {
            if (err) {
                return reject({
                    status: 'fail',
                    msg: err.message
                })
            }

            result = JSON.parse(JSON.stringify(result))
            if (result.length !== 1) {
                return reject({ status: "fail", msg: "获取用户信息失败" })
            }
            return resolve({
                status: "success",
                data: result[0]
            })
        })
    })
}

/**
 * @description: 检测密码是否正确
 * @param {账号} account
 * @param {旧密码} originPassword
 * @param {新密码} password
 * @return {*}
 */
const checkPassword = ({ account, originPassword, password }) => {
    return new Promise((resolve, reject) => {
        const checkPasswordSql = `SELECT password FROM users WHERE account = ?`
        db.query(checkPasswordSql, account, (err, result) => {
            if (err) {
                return reject({
                    status: "fail",
                    msg: err.message || err.sqlMessage
                })
            }

            if (result.length !== 1) {
                return reject({
                    status: "fail",
                    msg: '该用户不存在'
                })
            }

            const { password: hash } = result[0]

            const bcrypt = require('bcrypt')
            const comparison = bcrypt.compareSync(originPassword, hash)

            if (!comparison) {
                return reject({
                    status: 'fail',
                    msg: '原密码错误'
                })
            }

            return resolve({
                status: "success",
                msg: "密码正确"
            })

        })
    })
}

/**
 * @description: 修改密码
 * @param {账号} account
 * @param {新密码} password
 * @return {*}
 */
const updatePwd = (account, pwd) => {
    return new Promise((resolve, reject) => {
        const updatePwdSql = `UPDATE users SET password = ? WHERE account = ? and is_active = 'true'`
        const bcrypt = require('bcrypt')

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(pwd, salt, (err, hash) => {
                if (err) {
                    return reject({
                        status: 'fail',
                        msg: '密码加密出错'
                    })
                } else {
                    db.query(updatePwdSql, [hash, account], (err, result) => {
                        if (err) {
                            return reject({
                                status: "fail",
                                msg: err.message || err.sqlMessage
                            })
                        }

                        if (result.affectedRows !== 1) {
                            return reject({
                                status: "fail",
                                msg: '修改密码失败'
                            })
                        } else {
                            return resolve({
                                status: "success"
                            })
                        }
                    })
                }
            });
        });
    })


}

module.exports = {
    userUpdateHandler,
    userInfoHandler,
    pswChangeHandler,
    imageUploadHandler,
    emailHandler
}