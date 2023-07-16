import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { EmailInfoAPI, ManualEmailAPI } from "@/request/api"
import { Form, message, Space, Input, Button } from "antd"
import dayjs from "dayjs"
import style from "@/components/postal/KeyLetter/KeyLetter.module.scss"
import { CopyToClipboard } from 'react-copy-to-clipboard';


type ParamsType = {
    [key: string]: string
}

const Key: React.FC = () => {
    const search = useLocation().search
    const [emailInfo, setEmailInfo] = useState<EmailInfoAPIReqData | undefined>()

    useEffect(() => {
        if (!search) return setEmailInfo(undefined)
        const arr = search.split("?")[1].split("&")
        const obj: ParamsType = {}
        for (let i of arr) {
            obj[i.split("=")[0]] = i.split("=")[1];  //对数组每项用=分解开，=前为对象属性名，=后为属性值
        }
        if (obj.key) {
            EmailInfoAPI({ key: obj.key }).then(res => {
                console.log(res);
                setEmailInfo(res.data)
            }).catch(err => {
                message.error(err.msg)
            })
        }
    }, [search])


    const onFinish = (values: { key: string }) => {
        ManualEmailAPI({ email_key: values.key }).then(res => {
            message.success('邮件发送成功')
        }).catch(err => {
            console.log(err);
            message.error(err.msg)
            message.success('邮件发送成功')
            
        })

    };

    const InfoWithData: React.FC = () => {
        return (
            <Space direction="vertical" style={{ display: 'flex' }}>
                <div>邮件提交成功! 它将在<span className={style.black_bold}>{dayjs(emailInfo?.send_time).format('YYYY-MM-DD HH:mm:ss')}</span>发往<span className={style.black_bold}>{emailInfo?.destination_mail}</span></div>
                <div>你也可以保存以下提取码, 到期后在<Link className={style.blue} to="/postal/manual">手动提取</Link>页面获得邮件。（此页面仅你可见, 且将在<span style={{ color: "red" }}>100</span>秒后过期）</div>
                <CopyToClipboard text={emailInfo!.mail_key} onCopy={() => message.success("复制成功")}>
                    <span className={style.red_bold} style={{ cursor: "pointer" }} title="点击复制">{emailInfo?.mail_key}</span>
                </CopyToClipboard>
                <div>邮件发送和手工提取两种方式不会互相影响, 只是多一种提取手段!</div>
                <div><span className={style.black_bold} style={{ fontSize: ".17rem" }}>邮件内容预览</span></div>
                <div dangerouslySetInnerHTML={{ __html: emailInfo?.content! }}></div>
            </Space>
        )
    }

    const InfoWithoutData: React.FC = () => {
        return (
            <Space direction="vertical" style={{ display: 'flex' }}>
                <div>
                    <div>输入你在写信之后获得的提取码，如果验证成功，且该信件已经到了发送时间，则可以获得对应的时光邮件。</div>
                    <div>手工提取不会影响邮件的发送，只是多一种提取的方式而已。</div>
                </div>
                <Form
                    name="keyForm"
                    labelCol={{ span: 4 }}
                    labelAlign="left"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="请填写提取码"
                        name="key"
                        rules={[{ required: true, message: '请输入提取码!' }]}
                    >
                        <Input placeholder="输入曾经收到的提取码, 手工提取时光信件" />
                    </Form.Item>
                    <Form.Item labelAlign="right" style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" style={{ width: "2.26rem", backgroundColor: "#337ab7", borderRadius: ".04rem", borderColor: "#337ab7" }}>
                            我要提取
                        </Button>
                    </Form.Item>
                </Form>

            </Space>
        )
    }

    return (
        <div className={style.key_letter_content}>
            {emailInfo ? <InfoWithData /> : <InfoWithoutData />}
        </div>
    )
}

export default Key;