import { Button, Modal, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import style from "@/components/ChangeUserInfoModal/ChangeUserInfoModal.module.scss";
import AvatarUpload from './AvatarUpload';
import configObj from '@/assets/js/config.js';
import { useSelector } from 'react-redux';
import { UpdateUserInfoAPI } from "@/request/api"
import { useDispatch } from "react-redux"
import userInfoStatus from '@/store/UserInfo';

const ChangeUserInfoModal: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    // 从redux中获取用户信息
    const { userInfo } = useSelector((state: RootState) => ({
        userInfo: state.userInfoReducer
    }))

    const { avatar, account, email, nickname } = userInfo
    const initValues = { avatar, account, email, nickname }


    const handleOk = () => {
        setConfirmLoading(true);

        form.validateFields().then(res => {
            const { avatar, nickname } = res
            const sendData = { avatar, nickname }
            if (avatar === initValues.avatar && nickname === initValues.nickname){
                setConfirmLoading(false);
                return message.warning('您还未修改个人信息!')
            }


            setTimeout(() => {
                UpdateUserInfoAPI(sendData).then((result) => {
                    message.success('个人信息修改成功')
                    setOpen(false)
                    dispatch(userInfoStatus.asyncActions.asyncGetUserInfo as any)
                }).catch((err) => {
                    message.error(err.msg)
                }).finally(() => {
                    setConfirmLoading(false);
                });
            }, 500);
        }).catch(err => {
            setConfirmLoading(false);
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
            <span onClick={() => setOpen(true)} style={{ display: "block" }}>修改个人信息</span>
            <Modal className={style.changeUserInfoModal} title="修改个人信息" footer={buttons} open={open} confirmLoading={confirmLoading} maskClosable={false} destroyOnClose closable={false} centered afterClose={() => setConfirmLoading(false)} >
                <Form name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 20 }} autoComplete="off" form={form} preserve={false} initialValues={initValues} >
                    <Form.Item label="头像" name="avatar" >
                        <AvatarUpload />
                    </Form.Item>

                    <Form.Item label="账号" name="account" >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="邮箱" name="email" >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="昵称" name="nickname" rules={[{ pattern: configObj.RegNickname, message: "昵称仅支持4到16位英文、中文和下划线" }]} >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ChangeUserInfoModal;