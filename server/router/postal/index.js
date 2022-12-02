const router = require('express').Router()
const { recordPostalHandler } = require('./routerHandler/recordPostalHandler')
const { emailInfoHandler } = require('./routerHandler/emailInfoHandler')
const { emailManualHandler } = require('./routerHandler/emailManualHandler')
const { body } = require('express-validator');
const { RegDateTime } = require('@root/config')

// 记录邮件信息
router.post('/record', [
    body('uuid').notEmpty().withMessage('uuid不能为空'),
    body('verifyCode').notEmpty().withMessage("验证码不能为空"),
    body("name").notEmpty().withMessage("姓名不能为空").isLength({ max: 120 }).withMessage("姓名不能大于120个中文字符"),
    body("mail").notEmpty().withMessage("邮箱不能为空").isEmail().withMessage("邮箱格式错误"),
    body('time').notEmpty().withMessage('发信时间不能为空').matches(RegDateTime).withMessage('发信时间格式错误'),
    body("content").notEmpty().withMessage("发信内容不能为空"),
], recordPostalHandler)

// 获取邮件信息
router.post("/email/info", emailInfoHandler)

// 手动发送
router.post("/mail/manual",[
    body("email_key").notEmpty().withMessage("提取码不能为空")
], emailManualHandler)


module.exports = router