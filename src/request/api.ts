import request from "@/request";

// 验证码
export const CaptchaAPI = (data: { uuid: string }) => request.get("/users/captcha", { params: data });

// 注册
export const RegisterAPI = (data: RegisterAPIReq): Promise<RegisterAPIRes> => request.post("/users/reguser", data)

// 登录
export const LoginAPI = (data: LoginAPIReq): Promise<LoginAPIRes> => request.post("/users/login", data)
