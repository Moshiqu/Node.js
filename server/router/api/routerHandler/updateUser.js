const db = require('@root/db')
const { validationResult } = require('express-validator')

const userUpdateHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.send({ status: 'fail', msg: errArray[0].msg })
    }

    const { account } = req.auth
    const { avatar, nickname } = req.body
    updateUser(account, avatar, nickname)
        .then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err)
        })
}

const userInfoHandler = (req, res) => {
    const { account } = req.auth

    getUserInfo(account)
        .then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err)
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

const avatarChangeHandler = (req, res) => {
    const { path: filePath,originalname:fileName } = req.file

    if (!filePath) {
        return res.status(500).send({
            status: 'fail',
            msg: "头像上传失败",
        })
    }

    const { serverAddress: address, serverPort: port } = require('@root/config')
    return res.send({
        status:'success',
        msg:'头像上传成功',
        imgUrl: `${address}:${port}/avatar/${fileName}`,
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
        const updateUserSql = 'UPDATE users SET ? WHERE account = ?'
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
        const getUserInfoSql = `SELECT account, email, avatar, nickname FROM users WHERE account = ?`
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
    avatarChangeHandler
}