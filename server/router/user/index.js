const router = require('express').Router()
const { reguserHandler } = require('./routerHandler/sign')
const { check } = require('express-validator');

router.post('/reguser', [
    //字母开头，允许5-16字节，允许字母数字下划线
    check('account').notEmpty().withMessage('账号未设置').matches(/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/).withMessage('账号格式错误'),
    check('email').notEmpty().withMessage('邮箱未设置').isEmail().withMessage('邮箱格式错误'),
    check('password').notEmpty().withMessage('密码未设置').matches(/^[a-zA-Z]\w{5,17}$/).withMessage('密码格式错误'),
    check('repassword').notEmpty().withMessage('二次密码未设置'),
], reguserHandler)



module.exports = router