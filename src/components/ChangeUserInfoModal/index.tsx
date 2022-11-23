import { Button, Modal, Form, Input } from 'antd';
import React, { useState } from 'react';
import style from "@/components/ChangeUserInfoModal/ChangeUserInfoModal.module.scss";
import AvatarUpload from './AvatarUpload';



const ChangeUserInfoModal: React.FC = () => {
    const [open, setOpen] = useState(true);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm()

    const handleOk = () => {
        setConfirmLoading(true);

        setTimeout(() => {
            setConfirmLoading(false);
        }, 2000);
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
            <span onClick={() => setOpen(true)} style={{ width: '100%', height: '100%' }}>修改个人信息</span>
            <Modal className={style.changeUserInfoModal} title="修改个人信息" footer={buttons} open={open} confirmLoading={confirmLoading} maskClosable={false} destroyOnClose closable={false} centered afterClose={() => setConfirmLoading(false)} >
                <Form name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 20 }} autoComplete="off" form={form} preserve={false} >
                    <Form.Item label="头像" name="avatar" >
                        <AvatarUpload avatarUrl={'http://localhost:3001/avatar/yo.jpeg'} />
                    </Form.Item>

                    <Form.Item label="账号名" name="account" >
                        <Input />
                    </Form.Item>

                    <Form.Item label="邮箱" name="email" >
                        <Input />
                    </Form.Item>

                    <Form.Item label="昵称" name="nickname" >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ChangeUserInfoModal;