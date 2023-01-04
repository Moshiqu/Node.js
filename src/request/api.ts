import request from "@/request";

// /user
// 验证码
export const CaptchaAPI = (data: { uuid: string }) => request.get("/apis/user/captcha", { params: data });

// 注册
export const RegisterAPI = (data: RegisterAPIReq): Promise<RegisterAPIRes> => request.post("/apis/user/reguser", data)

// 登录
export const LoginAPI = (data: LoginAPIReq): Promise<LoginAPIRes> => request.post("/apis/user/login", data)

// /api
// 修改密码
export const ModifyPwdAPI = (data: LoginAPIReq): Promise<ModifyPwdAPIRes> => request.post("/apis/api/pswchange", data)

// 上传头像/图片
export const ChangeAvatarAPI = (data: ChangeAvatarAPIReq): Promise<ChangeAvatarAPIRes> => request.post('/apis/api/imageUpload', data)

// 用户基础信息
export const UserInfoAPI = (): Promise<UserInfoAPIRes> => request.get('/apis/api/userinfo')

// 修改基础信息
export const UpdateUserInfoAPI = (data: UpdateUserInfoAPIRes): Promise<UpdateUserInfoAPIReq> => request.post('/apis/api/update', data)

// /postal
// 保存邮件信息
export const PostalAPI = (data: PostalAPIRes): Promise<PostalAPIReq> => request.post('/apis/postal/record', data)

// 获取邮件信息
export const EmailInfoAPI = (data: EmailInfoAPIRes): Promise<EmailInfoAPIReq> => request.post('/apis/postal/email/info', data)

// 手动发送邮件
export const ManualEmailAPI = (data: ManualEmailAPIRes): Promise<ManualEmailAPIReq> => request.post('/apis/postal/mail/manual', data)

// 获取公开信
export const PublicEmailsAPI = (data: PublicEmailsAPIReq): Promise<PublicEmailsAPIRes> => request.get('/apis/postal/mail/public', { params: data })

// 根据邮件id获取邮件信息和评论
export const EmailInfoAndCommentAPI = (data: EmailInfoAndCommentAPIReq): Promise<EmailInfoAndCommentAPIRes> => request.get('/apis/postal/email', { params: data })

// 写入评论
export const EmailCommentAPI = (data: EmailCommentAPIReq): Promise<EmailCommentAPIRes> => request.post('/apis/postal/email/comment', data)

// 获取随机邮件id
export const RandomEmailIdAPI = (): Promise<RandomEmailIdAPIRes> => request.get('/apis/postal/email/random')

// 搜索邮件
export const SearchEmailsApi = (data: EmailSearchAPIReq): Promise<EmailSearchAPIRes> => request.get('/apis/postal/email/search', { params: data })

// 获取邮件列表
export const EmailsListApi = (data: EmailsListAPIReq): Promise<EmailsListRes> => request.get('/apis/postal/email/emails-list', { params: data })

// 取消公开信
export const RevokePublicApi = (data: PublicRevokeAPIReq): Promise<PublicRevokeAPIRes> => request.post('/apis/postal/email/public-revoke', data)