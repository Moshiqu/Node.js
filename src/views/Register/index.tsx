import { Button, Input, message, Form, Space } from 'antd';
import React, { useEffect, useState } from "react";
import style from "@/views/Login/init.module.scss";
import initRegisterBg from "@/assets/js/init.js";
import 'antd/dist/antd.css';
import '@/views/Register/register.less'
import { v4 as uuidv4 } from 'uuid';
import { CaptchaAPI, RegisterAPI } from '@/request/api';
import configObj from '@/assets/js/config.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const View: React.FC = () => {

    const [uuid, setUuid] = useState("")
    const [flag, setFlag] = useState(true)
    const [svgTag, setSvgTag] = useState('')
    const [loading, setLoading] = useState(false)


    const [form] = Form.useForm()

    const navigate = useNavigate()

    useEffect(() => {
        initRegisterBg();
        window.onresize = function () {
            initRegisterBg();
        };

        return () => {
            window.onresize = null
        }
    }, []);

    useEffect(() => {
        if (!flag) {
            CaptchaAPI({ uuid }).then(res => {
                setSvgTag(res.data.img)
            }).catch(err => {
                setSvgTag('')
                console.log(err);
            })
        }
    }, [uuid, flag])

    const CaptchaBtn = () => {
        if (svgTag) {
            return <div dangerouslySetInnerHTML={{ __html: svgTag }} className="captchaImg" title='点击重新获取验证码'></div>
        }
        return <Button type='primary' style={{ width: '1.02rem' }} >获取验证码</Button>
    }

    const onFinish = (values: any) => {
        setLoading(true)
        const { captcha, email, password, repassword, username } = values
        const data = {
            account: username,
            email,
            password,
            repassword,
            captcha,
            uuid
        }
        RegisterAPI(data).then(() => {
            navigate('/login')
        }).catch(err => {
            setUuid(uuidv4())
            message.error(err.msg)
        }).finally(() => {
            setLoading(false)
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className={style.loginPage}>
            {/* canvas背景 */}
            <canvas id="canvas" className={style.canvas}></canvas>
            <div className={style.loginBox + " registerbox  "}>
                {/* 标题 */}
                <div className={style.title}>
                    <h1>这是个啥&nbsp;·&nbsp;注册</h1>
                    <p>Strive Everyday</p>
                </div>
                {/* 表格 */}
                <div className="form">
                    <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" form={form} >
                        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }, { pattern: configObj.RegAccount, message: "账号格式为5~16位仅包含下划线的纯数字和字母组合" }]}>
                            <Input placeholder='用户名' />
                        </Form.Item>

                        <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱!' }, { pattern: configObj.RegEmail, message: "邮箱格式不正确" }]}>
                            <Input placeholder='邮箱' />
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }, { pattern: configObj.RegPassword, message: "密码格式为6~18位仅包含下划线的纯数字和字母组合" }]}>
                            <Input.Password placeholder='密码' onPaste={e => e.preventDefault()} onCopy={e => e.preventDefault()} />
                        </Form.Item>

                        <Form.Item name="repassword" rules={[{ required: true, message: '请再次输入密码!' }, ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次密码输入不一致!'));
                            },
                        })]}>
                            <Input.Password placeholder='重复密码' onPaste={e => e.preventDefault()} onCopy={e => e.preventDefault()} />
                        </Form.Item>

                        <Form.Item>
                            <Space size={20} style={{ width: "100%", justifyContent: "space-between" }}>
                                <Form.Item name="captcha" noStyle rules={[{ required: true, message: '请输入验证码!' }]} className="captchaInput" >
                                    <Input placeholder="验证码" maxLength={configObj.captchaOption.size} />
                                </Form.Item>
                                <span onClick={() => {
                                    setFlag(false)
                                    setUuid(uuidv4())
                                }}>
                                    <CaptchaBtn />
                                </span>
                            </Space>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                注册
                            </Button>
                        </Form.Item>


                        <Form.Item labelAlign='right'>
                            <Link to={'/login'}>已有账号? 去登陆</Link>
                        </Form.Item>
                    </Form>
                </div>
            </div>

        </div >
    );
};

export default View;
