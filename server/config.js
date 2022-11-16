// 账号正则
const RegAccount = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
// 密码正则
const RegPassword = /^[a-zA-Z]\w{5,17}$/
// 邮箱正则
const RegEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
// 昵称正则
const RegNickname = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
// token生成的密钥
const TokenSecretKey = 'b9fcf57e16fa23b2d81bc587ffde4788'
// token配置对象
const TokenOptions = { expiresIn: '5d' }
// 验证码有效时间 以分钟为单位
const ExpiredVlideTime = 5
// 图形验证码配置
const captchaOption = {
    size: 4, // 4个字母
    noise: 2, // 干扰线2条
    color: true, // 文字颜色
    width: 90,
    height: 32,
    background: "#666", // 背景颜色
    // 数字的时候，设置下面属性。最大，最小，加或者减
    // mathMin: 1,
    // mathMax: 30,
    // mathOperator: "+",
}
// 服务器地址端口
const serverAddress = '127.0.0.1'
const serverPort = '3001'

module.exports = {
    RegAccount,
    RegPassword,
    RegEmail,
    RegNickname,
    TokenSecretKey,
    serverAddress,
    serverPort,
    captchaOption,
    ExpiredVlideTime,
    TokenOptions
}