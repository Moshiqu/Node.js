const db = require('../../../db')
const { validationResult } = require('express-validator')

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
        const { password, repassword, account, email } = req.body
        if (password === repassword) {
            Promise.all([isAccountExisted(account), isEmailExisted(email)])
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
                reject({
                    status: 'fail',
                    msg: err.message
                })
            } else {
                if (!result.length) {
                    resolve({
                        status: 'success',
                        msg: '当前账号可用'
                    })
                }
                reject({
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
                reject({
                    status: 'fail',
                    msg: err.message
                })
            } else {
                if (!result.length) {
                    resolve({
                        status: 'success',
                        msg: '当前邮箱可用'
                    })
                }
                reject({
                    status: 'fail',
                    msg: '当前邮箱已存在'
                })
            }
        })
    })
}

/**
 * @description: 新增用户
 * @param {password,account,email} 
 * @return {*}
 */
const insertUser = (userInfo) => {
    return new Promise((resolve, reject) => {
        const { password, account, email } = userInfo
        const insertSql = 'INSERT INTO users SET ?'

        // 使用bcrypt加密密码
        const bcrypt = require('bcrypt')
        const hash = bcrypt.hashSync(password, 5)

        const newUserData = { password: hash, account, email }


        db.query(insertSql, newUserData, (err, result) => {
            if (err) {
                // 插入数据库失败
                reject({
                    status: 'fail',
                    msg: err.message
                })
            }
            if (result.affectedRows === 1) {
                resolve({
                    status: "success"
                })
            }
            reject({
                status: "fail",
                msg: "新增用户出错"
            })
        })
    })
}

module.exports = {
    reguserHandler
}