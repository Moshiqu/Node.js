import React from 'react'
import { useLocation } from 'react-router-dom';
import style from '@/components/postal/EmailDetail/EmailDetail.module.scss';
import { Divider, Form, Input, Button, Space } from 'antd';

const { TextArea } = Input;

const EmailDetail: React.FC = () => {
    const emailId = useLocation().search.split("?")[1]


    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log('Change:', e.target.value);
    };

    return (
        <div className={style.EmailDetail}>
            <div className={style.EmailDetail_header}>
                <div>投递人: 静 35********@qq.com</div>
                <div>2022-12-05 17:58 寄往 2023-12-05 17:56 (<span style={{ color: 'red' }}>尚未寄送</span>)</div>
            </div>
            <div>
                还有半年就要中考了，希望你已经克服了幻想和孤独，别想太多，好好学习吧！
            </div>
            <Divider />
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout='inline'
                style={{ display: 'flex', justifyContent: "space-between" }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                labelAlign="left"
            >
                <Form.Item
                    label="昵称"
                    name="nickname"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input style={{ width: "2.2rem" }} placeholder="请输入昵称" />
                </Form.Item>

                <Form.Item
                    label="邮箱地址"
                    name="email"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input style={{ width: "3.45rem" }} placeholder="请输入有效的邮箱地址" />
                </Form.Item>

                <Form.Item>
                </Form.Item>

                <Form.Item
                    name="verifyCode"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Space size={[30, 0]}>
                        <div className={style.verifyCode_box}></div>
                        <Input style={{ width: "2.2rem" }} placeholder="输入验证码" />
                        <Button type="primary" htmlType="submit" >
                            评论一下
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
            
            <TextArea showCount maxLength={300} onChange={onChange} />
        </div >
    )
}

export default EmailDetail