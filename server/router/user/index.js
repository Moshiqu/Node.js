const router = require('express').Router()
const { reguserHandler, loginHandler, captchaHandler } = require('./routerHandler/sign')
const { oneOf, body } = require('express-validator');
const { RegAccount, RegPassword } = require('@root/config')

// 注册
router.post('/reguser', [
    body('account').notEmpty().withMessage('账号未设置').matches(RegAccount).withMessage('账号格式错误'),
    body('email').notEmpty().withMessage('邮箱未设置').isEmail().withMessage('邮箱格式错误'),
    body('password').notEmpty().withMessage('密码未设置').matches(RegPassword).withMessage('密码格式错误'),
    body('repassword').notEmpty().withMessage('二次密码未设置'),
    body('captcha').notEmpty().withMessage('图形验证码未输入').isLength({ min: 4, max: 4 }).withMessage('验证码格式错误')
], reguserHandler)

// 登录
router.post('/login', [
    oneOf([
        body('account').exists().withMessage('未输入账号'),
        body('email').exists().withMessage('未输入邮箱'),
    ]),
    body('password').notEmpty().withMessage('未输入密码'),
], loginHandler)

// 注册时获取图形验证码
router.get('/captcha', [
    body('account').notEmpty().withMessage('用户名不能为空')
], captchaHandler)


module.exports = router