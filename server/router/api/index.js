const router = require('express').Router()
const { userUpdateHandler } = require('./routerHandler/updateUser')
const { body } = require('express-validator');
const { RegNickname } = require('../../../config')
// 更新用户信息
router.post('/update', [
    body('avatar').notEmpty().withMessage('未上传头像').isURL().withMessage('头像地址不合法'),
    body('nickname').notEmpty().withMessage('未设置昵称').isLength({min:4,max:12}).withMessage('昵称格式错误').matches(RegNickname).withMessage('昵称格式错误'),
], userUpdateHandler)

module.exports = router