import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import style from '@/components/postal/EmailDetail/EmailDetail.module.scss';
import { Divider, Form, Input, Button, Space, message } from 'antd';
import { CaptchaAPI, EmailInfoAndCommentAPI } from '@/request/api';
import { v4 as uuidv4 } from 'uuid';
import configObj from '@/assets/js/config.js';
import Comments from '../Comments';

const { TextArea } = Input;

const EmailDetail: React.FC = () => {
    const [uuid, setUuid] = useState(uuidv4())
    const [svgTag, setSvgTag] = useState('')
    const [emailInfo, setEmailInfo] = useState<EmailInfoAndCommentAPIResData>()

    const emailId = Number(useLocation().search.split("?")[1])

    useEffect(() => {
        EmailInfoAndCommentAPI({ email_id: emailId }).then(res => {
            setEmailInfo(res.data.email_info)
            document.title = `这是个啥时光邮箱|${res.data.email_info.sender}的公开信`
        }).catch(err => {
            message.error(err.msg)
        })

        return () => {
            document.title = `这是个啥时光邮箱`
        }
    }, [emailId])

    useEffect(() => {
        CaptchaAPI({ uuid }).then(res => {
            setSvgTag(res.data.img)
        }).catch(err => {
            message.error(err.msg)
        })
    }, [uuid])

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log(uuid);
        console.log('Failed:', errorInfo);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log('Change:', e.target.value);
    };

    return (
        <div className={style.EmailDetail}>
            <div className={style.EmailDetail_header}>
                <div>投递人: {emailInfo?.sender} {emailInfo?.destination_mail}</div>
                <div>{emailInfo?.start_time} 寄往 {emailInfo?.send_time} (<span style={{ color: 'red' }}>{emailInfo?.is_send ? '已寄出' : "尚未寄出"}</span>)</div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: emailInfo?.content! }}></div>
            <Divider />
            <Form
                name="commentForm"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout='inline'
                style={{ display: 'flex', justifyContent: "space-between", height: ".7rem" }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                labelAlign="left"
            >
                <Form.Item
                    label="昵称"
                    name="nickname"
                    rules={[{ required: true, message: '请输入昵称!' }, { pattern: configObj.RegNickname, message: "昵称仅支持4到16位英文、中文和下划线" }]}
                >
                    <Input style={{ width: "2.2rem" }} placeholder="请输入昵称" />
                </Form.Item>

                <Form.Item
                    label="邮箱地址"
                    name="email"
                    rules={[{ required: true, message: '请输入邮箱地址!' }, { pattern: configObj.RegEmail, message: "邮箱格式不正确" }]}
                >
                    <Input style={{ width: "3.45rem" }} placeholder="请输入有效的邮箱地址" />
                </Form.Item>

                <Form.Item
                    name="verifyCode"
                    rules={[{ required: true, message: '请输入验证码!' }]}
                    style={{ marginRight: 0 }}
                >
                    <Space size={[30, 0]} >
                        <div style={{ position: "relative" }}>
                            <div dangerouslySetInnerHTML={{ __html: svgTag }} onClick={() => setUuid(uuidv4())} title='点击重新获取验证码' className={style.CaptchaImg}></div>
                            <Input style={{ width: "2.2rem" }} placeholder="输入验证码" />
                        </div>
                        <Button type="primary" htmlType="submit" >
                            评论一下
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            <TextArea showCount maxLength={300} onChange={onChange} placeholder="来说两句吧..." style={{marginBottom:".3rem"}} />
            <Comments />
        </div >
    )
}

export default EmailDetail