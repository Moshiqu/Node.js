import { Button, Modal, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import configObj from '@/assets/js/config.js';
import { ModifyPwdAPI } from "@/request/api"
import { useNavigate } from 'react-router-dom';
import { removeCookie } from "@/utils/cookies"

const ChangePwdModal: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm()
    const navigateTo = useNavigate()

    const handleOk = () => {

        form.validateFields().then(res => {
            const { currentPassword, newPassword } = res
            const sendData: ModifyPwdAPIReq = { originPassword: currentPassword, password: newPassword }
            setConfirmLoading(true);
            // TODO useState 必须要有同步获取方式 rz办法:setTimeout
            setTimeout(() => {
                ModifyPwdAPI(sendData).then(result => {
                    console.log(result, '---result');
                    message.success('密码修改成功, 3秒后跳转至登录页面...')
                    setTimeout(() => {
                        localStorage.removeItem('token')
                        removeCookie('password')
                        navigateTo('/login')
                    }, 3000);
                }).catch(err => {
                    message.error(err.msg)
                    console.log(err, '---err');
                }).finally(() => {
                    setConfirmLoading(false);
                })
            }, 500);
        }).catch(error => {
            console.log(error, '----error');
        })
    };

    const reset = () => {
        form.resetFields()
    }

    const buttons = [
        <Button onClick={reset} key='reset'>
            重置
        </Button>,
        <Button onClick={() => setOpen(false)} key="cancel">
            取消
        </Button>,
        <Button type="primary" onClick={handleOk} key="ok" loading={confirmLoading} >
            确定
        </Button>
    ]

    return (
        <>
            <span onClick={() => setOpen(true)} style={{ display: "block" }}>修改密码</span>
            <Modal title="修改密码" footer={buttons} open={open} confirmLoading={confirmLoading} maskClosable={false} destroyOnClose closable={false} centered afterClose={() => setConfirmLoading(false)} >
                <Form
                    name="basic"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 20 }}
                    autoComplete="off"
                    form={form}
                    preserve={false}
                >
                    <Form.Item
                        label="原密码"
                        name="currentPassword"
                        rules={[{ required: true, message: '请输入原密码!' }, { pattern: configObj.RegPassword, message: "原密码格式不正确" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="新密码"
                        name="newPassword"
                        rules={[{ required: true, message: '请输入新密码!' }, { pattern: configObj.RegPassword, message: "密码格式为6~18位仅包含下划线的纯数字和字母组合" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="新密码"
                        name="newRepassword"
                        rules={[{ required: true, message: '请再次输入新密码!' }, ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次密码输入不一致!'));
                            },
                        })]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ChangePwdModal;