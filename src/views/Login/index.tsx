import { Button, Input, Switch, message, Form, Space, Spin } from 'antd';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import initLoginBg from "@/assets/js/init.js";
import 'antd/dist/antd.css';
import '@/views/Login/login.less'
import { Link } from 'react-router-dom';
import configObj from '@/assets/js/config.js';
import { LoginAPI } from '@/request/api';
import { getCookie, setCookie, removeCookie } from "@/utils"
import style from "@/views/Login/init.module.scss";

const View: React.FC = () => {
    const [isRemember, setIsRember] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form] = Form.useForm()
    const navigate = useNavigate()

    useEffect(() => {
        initLoginBg();
        window.onresize = function () {
            initLoginBg();
        };

        return ()=>{
            window.onresize = null
        }
    }, []);

    useEffect(() => {
        if (getCookie('username') !== '' && getCookie('password') !== '') {
            form.setFieldsValue({ username: getCookie('username'), password: getCookie('password') })
            setIsRember(getCookie("remember") as boolean)
        }
    }, [form])

    const onFinish = (values: any) => {
        console.log('Successed:', values);
        setLoading(true)
        const { username, password } = values
        const data: LoginAPIReq = {
            password,
        }
        configObj.RegEmail.test(username) ? data.email = username : data.account = username

        LoginAPI(data).then(res => {
            if (isRemember) {
                setCookie('username', username, 1)
                setCookie('password', password, 1)
                setCookie('remember', isRemember, 1)
            } else {
                removeCookie('username')
                removeCookie('password')
                removeCookie('remember')
            }
            navigate('/')
            localStorage.setItem('token', res.token as string)
        }).catch(err => {
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
            <Spin size='large' style={{ maxHeight: 'initial' }} tip="Loading..." spinning={loading}>
                {/* canvas背景 */}
                <canvas id="canvas" className={style.canvas}></canvas>
                <div className={style.loginBox + " loginbox"}>
                    {/* 标题 */}
                    <div className={style.title}>
                        {/* <h1>俺自己的项目&nbsp;·&nbsp;前端</h1> */}
                        <h1>这是个啥&nbsp;·&nbsp;登录</h1>
                        <p>Strive Everyday</p>
                    </div>
                    {/* 表格 */}
                    <div className="form">
                        <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" form={form} >
                            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名或邮箱!' }]}>
                                <Input placeholder='用户名或邮箱' />
                            </Form.Item>

                            <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }, { pattern: configObj.RegPassword, message: "密码格式不正确" }]}>
                                <Input.Password placeholder='密码' onPaste={e => e.preventDefault()} onCopy={e => e.preventDefault()} />
                            </Form.Item>

                            <Form.Item>
                                <Space size={20} style={{ width: "100%", justifyContent: "space-between" }}>
                                    <Space className='remember' size={0}>
                                        <Switch checked={isRemember} onChange={(val) => setIsRember(val)} />
                                        <span>记住密码</span>
                                    </Space>
                                    <Space>
                                        <Link to={'/user'}>忘记密码?</Link>
                                    </Space>
                                </Space>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    登录
                                </Button>
                            </Form.Item>

                            <Form.Item labelAlign='right'>
                                <Link to={'/register'}>没有账号? 去注册</Link>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default View;
