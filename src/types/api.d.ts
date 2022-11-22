// 注册接口请求数据类型
type RegisterAPIReq = {
    captcha: string,
    email: string,
    password: string,
    repassword: string,
    account: string,
    uuid: string
}

// 登录接口请求数据类型
type LoginAPIReq = {
    email?: string,
    account?: string,
    password: string
}

// 获取验证码接口返回数据类型
interface CaptchaAPIRes {
    status: string;
    data: {
        img: string;
        str: string;
    };
}

// 注册接口返回数据类型
interface RegisterAPIRes {
    status: string;
    msg?: string;
}

// 登录接口返回数据类型
interface LoginAPIRes {
    status: string;
    token?: string;
    msg?: string;
}

// 密码修改接口请求数据类型
type ModifyPwdAPIReq = {
    originPassword: string;
    password: string;
}

interface ModifyPwdAPIRes {
    status: string;
    msg?: string;
}
