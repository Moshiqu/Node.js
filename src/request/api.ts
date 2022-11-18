import request from '@/request';

type LoginData = {
    account: string,
    uuid: string
}

// 验证码
export const captchaAPI = (data: LoginData) => request.get("/user/captcha", { params: data })