import React, { useEffect, useState } from 'react'
import style from "@/components/postal/SearchLetter/SearchLetter.module.scss"
import { Button, Form, Input, notification } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { CaptchaAPI, SearchEmailsApi } from '@/request/api';
import useStateRef from 'react-usestateref'
import FormModal from '../FormModal';

type SearchFormType = {
    setFormModalOpenHandler: Function,
    setEmailsListHandler: Function
}

const SearchForm: React.FC<SearchFormType> = (props) => {
    const [uuid, setUuid] = useStateRef(uuidv4())
    const [svgTag, setSvgTag] = useState<string>('')
    const [api, contextHolder] = notification.useNotification();


    const { setFormModalOpenHandler, setEmailsListHandler } = props

    useEffect(() => {
        CaptchaAPI({ uuid }).then(res => {
            setSvgTag(res.data.img)
        }).catch(err => {
            console.log(err);
        })
    }, [uuid])

    const onFinish = (values: any) => {
        console.log('Success:', values);
        values.uuid = uuid
        SearchEmailsApi(values).then(res => {
            console.log(res);
            if (!res.emailsList.length) return api.open({ message: '通知', description: res.msg || '未查询到邮件信息', });
            setEmailsListHandler(res.emailsList)
            setFormModalOpenHandler(true)
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setUuid(uuidv4())
        })
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
            {contextHolder}
            <Form.Item
                label="你的姓名"
                name="name"
                rules={[{ required: true, message: '请填写你的名字!' }, { max: 120, message: "名字不能多于120个中文字符" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="邮箱地址"
                name="emailAddress"
                rules={[{ required: true, message: '请填写曾经填写的收信邮箱地址!' }, { type: "email", message: "邮箱格式不合法" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item style={{ display: 'flex', justifyContent: "flex-end" }}>
                <div style={{ marginRight: "30px", cursor: 'pointer' }} dangerouslySetInnerHTML={{ __html: svgTag }} onClick={() => setUuid(uuidv4())}></div>
                <Form.Item
                    name="verification"
                    rules={[{ required: true, message: '请填写验证码!' }]}
                >
                    <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '1.26rem', marginLeft: "30px" }}>
                    搜索
                </Button>
            </Form.Item>
        </Form>
    );
}

const SearchLetter: React.FC = () => {
    const titleText = `根据名字、邮箱地址进行邮件搜索，验证成功后可以进行操作：取消公开信，或者重新发送一遍到邮箱（仅针对到期邮件）。`

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [emailsList, setEmailsList] = useState([])

    return (
        <div className={style.SearchLetter}>
            <div style={{ marginBottom: "24px" }}>{titleText}</div>
            <SearchForm setFormModalOpenHandler={setFormModalOpen} setEmailsListHandler={setEmailsList} />
            <FormModal emailsList={emailsList} formModalOpen={formModalOpen} setFormModalOpenHandler={setFormModalOpen} />
        </div>
    )
}

export default SearchLetter