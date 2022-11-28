const db = require('@root/db')
const { validationResult } = require('express-validator')

const recordPostalHandler = (req, res) => {
    const errArray = validationResult(req).errors
    if (errArray.length) {
        return res.status(500).send({
            status: "fail",
            msg: errArray[0].msg
        })
    }

    console.log(req.session);
}

/**
 * @description: 邮件保存
 * @param {uuid} uuid
 * @param {verifyCode} 验证码
 * @param {name} 发信人
 * @param {mail} 发信邮箱
 * @param {time} 发信时间
 * @param {content} 邮件内容
 * @return {*}
 */
const updatePwd = (account, pwd) => {
  
}

module.exports = {
    recordPostalHandler,
}