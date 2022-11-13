const router = require('express').Router()
const { userUpdateHandler, userInfoHandler, pswChangeHandler } = require('./routerHandler/updateUser')
const { body } = require('express-validator');
const { RegNickname, RegAccount, RegPassword } = require('@root/config')
// 更新用户信息
router.post('/update', [
    body('avatar').notEmpty().withMessage('未上传头像').isURL().withMessage('头像地址不合法'),
    body('nickname').notEmpty().withMessage('未设置昵称').isLength({ min: 4, max: 12 }).withMessage('昵称格式错误').matches(RegNickname).withMessage('昵称格式错误'),
], userUpdateHandler)

// 获取用户信息
router.get('/userinfo', [
    body('account').notEmpty().withMessage('缺少参数account').matches(RegAccount).withMessage('账号格式错误')
], userInfoHandler)

// 修改密码
router.post('/pswchange', [
    body('originPassword').notEmpty().withMessage('缺少参数originPassword').matches(RegPassword).withMessage('旧密码格式错误'),
    body('password').notEmpty().withMessage('缺少参数password').matches(RegPassword).withMessage('新密码格式错误')
], pswChangeHandler)

module.exports = router