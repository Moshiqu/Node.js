const db = require('@root/db')
const { validationResult } = require('express-validator')

const createCommentHandler = async (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: "fail",
            msg: errArray[0].msg
        })
    }

    const { email_id, nickname, verify_code, uuid, comment, comment_email } = req.body
    try {
        await checkVerifyCode(verify_code, uuid)
        await writeComment(comment, email_id, comment_email, nickname)
        return res.send({ status: "success", msg: "写入评论成功" })
    } catch (error) {
        return res.send(error)
    }
}

/**
 * @description: 校验验证码
 * @param {verify_code} 验证码
 * @param {uuid} uuid
 * @return {*}
 */
const checkVerifyCode = (verifyCode, uuid) => {
    return new Promise((resolve, reject) => {
        const checkVerifyCodeSql = `SELECT start_time FROM captcha WHERE uuid = ? and text = ? and is_active = "true"`
        db.getConnection((err, conn) => {
            if (err) return reject({ status: "fail", msg: '从连接池获取连接失败' })
            conn.query(checkVerifyCodeSql, [uuid, verifyCode], (err, result) => {
                if (err) return reject({ status: 'fail', msg: err.message || err.sqlMessage })

                result = JSON.parse(JSON.stringify(result))

                if (result.length !== 1) return reject({ status: 'fail', msg: '验证码错误' })

                deleteVerifyCode(uuid)

                const { start_time } = result
                const currentStamp = new Date().getTime()
                const { ExpiredVlideTime } = require('@root/config')
                const expiredStamp = new Date(start_time).getTime() + (ExpiredVlideTime * 60 * 1000)

                if (currentStamp > expiredStamp) return reject({ status: 'fail', msg: "验证码已过期,请重新获取" })

                return resolve({ status: "success", msg: "验证码验证成功" })
            })
            db.releaseConnection(conn);//释放连接池，等待别的连接池使用
        })
    })
}

/**
 * @description: 写入评论
 * @param {comment_content} 评论
 * @param {email_id} 邮件id
 * @param {comment_mail_address} 评论人邮箱
 * @param {comment_nickname} 评论人昵称
 * @return {*}
 */
const writeComment = (comment_content, email_id, comment_mail_address, comment_nickname) => {
    return new Promise((resolve, reject) => {
        const writeCommentSql = `INSERT INTO postal_comments SET ?`
        db.getConnection((err, conn) => {
            if (err) return reject({ status: "fail", msg: "从连接池获取连接失败" })

            conn.query(writeCommentSql, { comment_content, comment_nickname, comment_mail_address, email_id }, (err, result) => {
                if (err) return reject({ status: 'fail', msg: err.message || err.sqlMessage })

                result = JSON.parse(JSON.stringify(result))

                if (result.affectedRows !== 1) return reject({ status: "fail", msg: "写入评论失败" })
                return resolve({ status: "success", msg: "写入评论成功" })
            })

            db.releaseConnection(conn);//释放连接池，等待别的连接池使用
        })
    })
}

/**
 * @description: 删除验证码
 * @param {uuid} uuid
 * @return {*}
 */

const deleteVerifyCode = (uuid) => {
    const deleteVerifyCodeSql = `UPDATE captcha SET ? WHERE uuid = ?`
    db.getConnection((err, conn) => {
        if (err) return console.log({ status: "fail", msg: "从连接池获取连接失败" })
        conn.query(deleteVerifyCodeSql, [{ is_active: 'false' }, uuid], (err, result) => {
            if (err || result.affectedRows !== 1) return console.log({ status: 'fail', msg: "删除验证码失败" })
            console.log(result);
            return console.log({ status: "success", msg: "删除验证码成功" })
        })
        db.releaseConnection(conn);//释放连接池，等待别的连接池使用
    })
}

module.exports = {
    createCommentHandler,
}