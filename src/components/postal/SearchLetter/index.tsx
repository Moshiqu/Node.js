import React, { useEffect, useState } from 'react'
import style from "@/components/postal/SearchLetter/SearchLetter.module.scss"
import { Button, Form, Input, notification, Space, Table, Modal } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { CaptchaAPI, SearchEmailsApi } from '@/request/api';
import useStateRef from 'react-usestateref'
import type { ColumnsType } from 'antd/es/table';
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';

type SearchFormPropsType = {
    setShowSearchListHandler: Function,
    setSearchListHandler: Function
}

type SearchListPropsType = {
    searchList: EmailSearchData[]
}

const SearchForm: React.FC<SearchFormPropsType> = (props) => {
    const { setShowSearchListHandler, setSearchListHandler } = props

    const [uuid, setUuid] = useStateRef(uuidv4())
    const [svgTag, setSvgTag] = useState<string>('')
    const [buttonLoading, setButtonLoading] = useState(false)
    const [api, contextHolder] = notification.useNotification();

    const titleText = `根据名字、邮箱地址进行邮件搜索，验证成功后可以进行操作：取消公开信，或者重新发送一遍到邮箱（仅针对到期邮件）。`

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
        setButtonLoading(true)
        SearchEmailsApi(values).then(res => {
            if (!res.emailsList.length) return api.open({ message: '通知', description: res.msg || '未查询到邮件信息', });
            setSearchListHandler(res.emailsList)
            setShowSearchListHandler(false)
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setUuid(uuidv4())
            setButtonLoading(false)
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        setShowSearchListHandler(false)
    };

    return (
        <>
            <div style={{ marginBottom: "24px" }}>{titleText}</div>
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
                    <Button type="primary" htmlType="submit" style={{ width: '1.26rem', marginLeft: "30px" }} loading={buttonLoading}>
                        搜索
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

const SearchList: React.FC<SearchListPropsType> = (props) => {
    interface DataType {
        key: number;
        sender: string;
        destination_mail: string;
        start_time: string;
        send_time: string;
        is_open: boolean;
        is_send: boolean;
    }

    const navigateTo = useNavigate()

    const { searchList } = props
    const [mapSearchList, setMapSearchList] = useState<DataType[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const mapArr = searchList.map(item => {
            const { id, start_time, sender, destination_mail, send_time, is_open, is_send } = item
            return {
                key: id,
                start_time,
                sender,
                destination_mail,
                send_time,
                is_open: is_open === 'true',
                is_send: is_send === 'true',
            }
        })
        setMapSearchList(mapArr)
    }, [searchList])

    const columns: ColumnsType<DataType> = [
        {
            title: '姓名',
            dataIndex: 'sender',
            key: 'sender',
        },
        {
            title: 'email地址',
            dataIndex: 'destination_mail',
            key: 'destination_mail',
        },
        {
            title: '创建时间',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (_, record) => (
                <span>{dayjs(record.start_time).format('YYYY-MM-DD HH:mm:ss')}</span>
            ),
        },
        {
            title: '收信时间',
            key: 'send_time',
            dataIndex: 'send_time',
            render: (_, record) => (
                <span>{dayjs(record.send_time).format('YYYY-MM-DD HH:mm:ss')}</span>
            )
        },
        {
            title: '是否公开',
            key: 'is_open',
            dataIndex: 'is_open',
            render: (_, record) => (
                <span>{record.is_open ? '是' : '否'}</span>
            ),
        },
        {
            title: '当前状态',
            key: 'is_send',
            dataIndex: 'is_send',
            render: (_, record) => (
                <span>{record.is_send ? '已寄出' : '尚未寄出'}</span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => navigateTo(`/postal/detail?${record.key}`)} type="primary" size='small'>查看</Button>
                    {
                        record.is_open ? <Button type="primary" size='small' onClick={() => setIsModalOpen(true)}>取消公开信</Button> : null
                    }
                    {
                        record.is_send ? null : <Button type="primary" size='small'>补发邮件</Button>
                    }
                </Space>
            ),
            width: '0'
        },
    ];

    const ComfirmModal = () => {
        return (
            <Modal title="Basic Modal" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        )
    }

    return (
        <>
            <Table columns={columns} dataSource={mapSearchList} pagination={false} />
            <ComfirmModal></ComfirmModal>
        </>
    )
}

const SearchLetter: React.FC = () => {
    const [showSearchList, setShowSearchList] = useState(true)
    const [searchList, setSearchList] = useState<EmailSearchData[]>([])

    useEffect(() => {
        document.title = `这是个啥时光邮箱|搜索邮件`
    }, [])

    return (
        <div className={style.SearchLetter}>
            {
                showSearchList
                    ?
                    <SearchForm setShowSearchListHandler={setShowSearchList} setSearchListHandler={setSearchList} />
                    :
                    <SearchList searchList={searchList} />
            }
        </div>
    )
}

export default SearchLetter