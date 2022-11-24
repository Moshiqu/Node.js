import request from "@/request";

// /users
// 验证码
export const CaptchaAPI = (data: { uuid: string }) => request.get("/users/captcha", { params: data });

// 注册
export const RegisterAPI = (data: RegisterAPIReq): Promise<RegisterAPIRes> => request.post("/users/reguser", data)

// 登录
export const LoginAPI = (data: LoginAPIReq): Promise<LoginAPIRes> => request.post("/users/login", data)

// /api
// 修改密码
export const ModifyPwdAPI = (data: LoginAPIReq): Promise<ModifyPwdAPIRes> => request.post("/api/pswchange", data)

// 上传头像
export const ChangeAvatarAPI = (data: ChangeAvatarAPIReq): Promise<ChangeAvatarAPIRes> => request.post('/api/avatarchange', data)

// 用户基础信息
export const UserInfoAPI = (): Promise<UserInfoAPIRes> => request.get('/api/userinfo')

// 修改基础信息
export const UpdateUserInfoAPI = (data: UpdateUserInfoAPIRes): Promise<UpdateUserInfoAPIReq> => request.post('/api/update', data)