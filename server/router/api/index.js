const router = require('express').Router()
const { userUpdateHandler, userInfoHandler, pswChangeHandler, avatarChangeHandler, emailHandler } = require('./routerHandler/updateUser')
const { body } = require('express-validator');
const { RegPassword } = require('@root/config')

const uploadUtil = require('@root/utils/upload')
// 更新用户信息
router.post('/update', userUpdateHandler)

// 获取用户信息
router.get('/userinfo', userInfoHandler)

// 修改密码
router.post('/pswchange', [
    body('originPassword').notEmpty().withMessage('缺少参数originPassword').matches(RegPassword).withMessage('旧密码格式错误'),
    body('password').notEmpty().withMessage('缺少参数password').matches(RegPassword).withMessage('新密码格式错误')
], pswChangeHandler)

// 更换头像
router.post('/avatarchange', uploadUtil.fileUpdate.single('avatar'), avatarChangeHandler)

// 发送邮件
router.post('/email', [body('email').notEmpty().withMessage('缺少邮箱').isEmail().withMessage('邮箱格式错误'),],emailHandler)

module.exports = router