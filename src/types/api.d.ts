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

// 上传头像 请求数据类型
type ChangeAvatarAPIReq = {
    avatar: Blob
}


interface ChangeAvatarAPIRes {
    status: string;
    msg?: string;
    imgUrl?: string;
}

// 获取用户基础信息 请求数据类型  不需要参数 account 从token中获取
interface UserInfoAPIRes {
    status: string;
    data: UserInfoAPIResData;
}

interface UserInfoAPIResData {
    account: string;
    email: string;
    avatar?: null | string;
    nickname?: null | string;
}

// 更新用户基础信息 请求数据类型
interface UpdateUserInfoAPIRes {
    avatar: string,
    nickname: string,
}

interface UpdateUserInfoAPIReq {
    status: string,
    msg?: string,
}

// 保存邮件信息
type PostalAPIRes = {
    uuid: string,
    verifyCode: string,
    name: string,
    mail: string,
    time: string,
    content: string,
    isOpen: boolean
}

interface PostalAPIReq {
    status: string,
    msg?: string,
}