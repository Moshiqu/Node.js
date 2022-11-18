import request from "@/request";

// 验证码
export const captchaAPI = (data: { uuid: string }) => request.get("/user/captcha", { params: data });

// 注册
export const registerAPI = (data: RegisterType) => request.post("/user/reguser", data)
