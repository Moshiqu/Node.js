import { Button, Modal, Form, Input } from 'antd';
import React, { useState } from 'react';
import configObj from '@/assets/js/config.js';
import { ModifyPwdAPI } from "@/request/api"

const App: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm()

    const handleOk = () => {
        // setConfirmLoading(true);
        // setTimeout(() => {
        //     setOpen(false);
        //     setConfirmLoading(false);
        // }, 2000);
        // TODO 提交表单导致页面刷新
        form.validateFields().then(res => {
            console.log(res,'===res');
            setConfirmLoading(true)
            const { currentPassword, newPassword } = res
            const sendData: ModifyPwdAPIReq = { originPassword: currentPassword, password: newPassword }
            ModifyPwdAPI(sendData).then((result) => {
                console.log(result, '---result');
            }).catch((err) => {
                console.log(err, '---err');
            });
        }).catch(error => {
            console.log(error, '----err');
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
        <Button type="primary" onClick={handleOk} key="ok" >
            确定
        </Button>
    ]

    return (
        <>
            <span onClick={() => setOpen(true)} style={{ width: '100%', height: '100%' }}>修改密码</span>
            <Modal title="修改密码" footer={buttons} open={open} confirmLoading={confirmLoading} maskClosable={false} destroyOnClose closable={false} centered >
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

export default App;