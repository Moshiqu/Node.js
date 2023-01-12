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
    status: 'fail' | 'success';
    data: {
        img: string;
        str: string;
    };
}

// 注册接口返回数据类型
interface RegisterAPIRes {
    status: 'fail' | 'success';
    msg?: string;
}

// 登录接口返回数据类型
interface LoginAPIRes {
    status: 'fail' | 'success';
    token?: string;
    msg?: string;
}

// 密码修改接口请求数据类型
type ModifyPwdAPIReq = {
    originPassword: string;
    password: string;
}

interface ModifyPwdAPIRes {
    status: 'fail' | 'success';
    msg?: string;
}

// 上传头像 请求数据类型
type ChangeAvatarAPIReq = {
    avatar: Blob
}


interface ChangeAvatarAPIRes {
    status: 'fail' | 'success';
    msg?: string;
    imgUrl?: string;
}

// 获取用户基础信息 请求数据类型  不需要参数 account 从token中获取
interface UserInfoAPIRes {
    status: 'fail' | 'success';
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
    status: 'fail' | 'success',
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
    status: 'fail' | 'success',
    msg?: string,
    data?: {
        key: string
    }
}

// 获取邮件信息
type EmailInfoAPIRes = {
    key: string
}

interface EmailInfoAPIReq {
    status: 'fail' | 'success',
    msg: string,
    data?: EmailInfoAPIReqData
}

type EmailInfoAPIReqData = {
    start_time: string,
    send_time: string,
    destination_mail: string,
    content: string,
    mail_key: string
}

// 手动发送邮件 请求
type ManualEmailAPIRes = {
    email_key: string
}

// 手动发送邮件 
interface ManualEmailAPIReq {
    status: 'fail' | 'success',
    msg?: string
}

// 获取公开邮件
type PublicEmailsAPIReq = {
    pageNum: number,
    pageSize: number,
    type: 1 | 2 | 3
}

interface PublicEmailsAPIRes {
    status: 'fail' | 'success',
    msg?: string,
    data?: PublicEmailsAPIResData[],
    pagination?: PaginationType
}

type PublicEmailsAPIResData = {
    sender: string,
    destination_mail: string,
    send_time: string,
    start_time: string,
    id: number,
    content: string,
    is_send: boolean
}

type PaginationType = {
    pageNum: number,
    pageSize: number,
    total: number
}

// 根据邮件id获取邮件信息
type EmailInfoAndCommentAPIReq = {
    email_id: number
}

interface EmailInfoAndCommentAPIRes {
    status: string;
    message: string;
    data: {
        email_info: EmailInfoAndCommentAPIResData
    };
}

type EmailInfoAndCommentAPIResData = {
    sender: string;
    destination_mail: string;
    send_time: string;
    start_time: string;
    is_send: boolean;
    content: string;
}

// 邮件写入评论
type EmailCommentAPIReq = {
    email_id: number,
    nickname: string,
    comment: string,
    verify_code: string,
    uuid: string,
    comment_email: string
}

interface EmailCommentAPIRes {
    status: 'success' | 'fail',
    msg: string
}

// 获取随机邮件id
interface RandomEmailIdAPIRes {
    msg: string,
    id?: number
}

// 查找邮件
type EmailSearchAPIReq = {
    verification: string,
    emailAddress: string,
    name: string,
    uuid: string
}

interface EmailSearchAPIRes {
    emailsList: EmailSearchData[],
    msg: string
}

interface EmailSearchData {
    id: number;
    is_active: string;
    start_time: string;
    sender: string;
    destination_mail: string;
    send_time: string;
    is_open: string;
    content: string;
    account?: string;
    mail_key: string;
    is_send: string;
}

// 邮件列表
type EmailsListAPIReq = {
    pageNum: number,
    pageSize: number
}

interface EmailsListRes {
    data: EmailsListData[];
    pagination: {
        pageNum: number;
        total: number;
        pageSize: number;
    };
}

interface EmailsListData {
    sender: string;
    destination_mail: string;
    start_time: string;
    send_time: string;
    is_send: boolean;
    id: number;
}

// 取消公开信
type PublicRevokeAPIReq = {
    id: number
}

interface PublicRevokeAPIRes {
    msg: string
}


// 根据邮件id获取评论
type RepliesAPIReq = {
    email_id: number,
    pageSize: number,
    pageNum: number
}

interface RepliesAPIRes {
    data: RepliesDatum[];
    pagination: Pagination;
}

interface Pagination {
    total: number;
    pageNum: number;
    pageSize: number;
}

interface RepliesDatum {
    content: string;
    nickname: string;
    email: string;
    time?: string;
    id:number
}