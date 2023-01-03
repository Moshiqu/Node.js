const router = require('express').Router()
const { recordPostalHandler } = require('./routerHandler/recordPostalHandler')
const { emailInfoHandler } = require('./routerHandler/emailInfoHandler')
const { emailManualHandler } = require('./routerHandler/emailManualHandler')
const { publicMailHandler } = require('./routerHandler/publicMailHandler')
const { viewEmailHandler } = require('./routerHandler/viewEmailHandler')
const { createCommentHandler } = require('./routerHandler/createCommentHandler')
const { getRandomEmailHandler } = require('./routerHandler/getRandomEmailHandler')
const { searchEmailHandler } = require('./routerHandler/searchEmailHandler')
const { emailsListHandler } = require('./routerHandler/emailsListHandler')
const { body, check } = require('express-validator');
const { RegDateTime, RegNickname, RegEmail } = require('@root/config')

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
router.post("/mail/manual", [
    body("email_key").notEmpty().withMessage("提取码不能为空")
], emailManualHandler)

// 获取公开信
router.get("/mail/public", [
    check("pageNum").notEmpty().withMessage("请求页码不能为空").matches(/^[1-9]\d*$/).withMessage("请求页码必须是非零正整数"),
    check("pageSize").notEmpty().withMessage("每页条数不能为空").matches(/^[1-9]\d*$/).withMessage("每页条数必须是非零正整数"),
    check("type").notEmpty().withMessage("分类类型不能为空")
], publicMailHandler)

// 根据id获取公开信
router.get("/email", [
    check("email_id").notEmpty().withMessage("邮件id不能为空")
], viewEmailHandler)

// 写入评论
router.post("/email/comment", [
    body("email_id").notEmpty().withMessage("邮件id不能为空"),
    body('nickname').notEmpty().withMessage("昵称不能为空").matches(RegNickname).withMessage('昵称格式错误'),
    body('comment').notEmpty().withMessage("评论不能为空").isLength({ max: 300 }).withMessage("评论字数不能超过300个字符"),
    body('comment_email').notEmpty().withMessage("评论邮箱不能为空").isEmail().withMessage("邮箱格式不正确"),
    body('verify_code').notEmpty().withMessage("验证码不能为空"),
    body('uuid').notEmpty().withMessage("uuid不能为空"),
], createCommentHandler)

// 获取随机一篇邮件id
router.get("/email/random", getRandomEmailHandler)

// 搜索邮件
router.get("/email/search", [
    check('verification').notEmpty().withMessage("验证码不能为空"),
    check("name").notEmpty().withMessage("查找邮件姓名不能为空").isLength({ max: 120 }).withMessage("姓名不能大于120个中文字符"),
    check("emailAddress").notEmpty().withMessage("查找邮件地址不能为空").matches(RegEmail).withMessage('邮件地址格式不正确'),
    check("uuid").notEmpty().withMessage("uuid不能为空"),
], searchEmailHandler)

// 邮件列表
router.get("/email/emails-list", [
    check("pageNum").notEmpty().withMessage("请求页码不能为空").matches(/^[1-9]\d*$/).withMessage("请求页码必须是非零正整数"),
    check("pageSize").notEmpty().withMessage("每页条数不能为空").matches(/^[1-9]\d*$/).withMessage("每页条数必须是非零正整数"),
], emailsListHandler)


module.exports = router