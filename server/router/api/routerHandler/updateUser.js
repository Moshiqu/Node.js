const db = require('../../../db')
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
    const errArray = validationResult(req).errors
    if (errArray.length) {
        // 未通过验证
        return res.send({
            status: 'fail',
            msg: errArray[0].msg
        })
    }

    const { account } = req.body

    getUserInfo(account)
        .then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err)
        })
}

/**
 * @description: 
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

module.exports = {
    userUpdateHandler,
    userInfoHandler
}