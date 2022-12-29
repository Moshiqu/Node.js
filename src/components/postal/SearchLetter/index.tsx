import React from 'react'
import style from "@/components/postal/SearchLetter/SearchLetter.module.scss"
import { Button, Checkbox, Form, Input } from 'antd';

const titleText = `根据名字、邮箱地址进行邮件搜索，验证成功后可以进行操作：取消公开信，或者重新发送一遍到邮箱（仅针对到期邮件）。`

const SearchForm: React.FC = () => {
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            labelAlign="left"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className={style.SearchForm}
        >
            <Form.Item
                label="你的姓名"
                name="name"
                rules={[{ required: true, message: '请填写你的名字!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="邮箱地址"
                name="emailAddress"
                rules={[{ required: true, message: '请填写曾经填写的收信邮箱地址!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item style={{display: 'flex', justifyContent:"flex-end"}}>
                <div style={{width:"90px",height:"40px"}}></div>
                <Form.Item
                    name="verification"
                >
                    <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '1.26rem' }}>
                    搜索
                </Button>
            </Form.Item>
        </Form>
    );
}

const SearchLetter: React.FC = () => {
    return (
        <div className={style.SearchLetter}>
            <div style={{marginBottom:"24px"}}>{titleText}</div>
            <SearchForm />
        </div>
    )
}

export default SearchLetter