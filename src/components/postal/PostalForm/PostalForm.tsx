import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Checkbox, DatePicker, Row, Col, message } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import '@/components/postal/PostalForm/postalForm.less';
import style from '@/components/postal/PostalForm/postalForm.module.scss'
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import type { RangePickerProps, DatePickerProps } from 'antd/es/date-picker';
import { Link, useNavigate } from 'react-router-dom';
import RichText from "@/components/postal/RichText"
import { CaptchaAPI, PostalAPI } from '@/request/api';

import useStateRef from 'react-usestateref'

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },

};
const PostalForm: React.FC = () => {
    const [form] = Form.useForm();

    const [flag, setFlag] = useState(true)
    const [uuid, setUuid] = useState("")
    const [svgTag, setSvgTag] = useState('')
    const [formData, setFormData, formDataRef] = useStateRef({
        uuid: "",
        verifyCode: "",
        name: "",
        mail: "",
        time: "",
        content: "",
        isOpen: false
    })

    useEffect(() => {
        if (!flag) {
            CaptchaAPI({ uuid }).then(res => {
                setSvgTag(res.data.img)
            }).catch(err => {
                setSvgTag('')
                message.error(err.msg)
            })
        }
    }, [uuid, flag])

    const navigateTo = useNavigate()
    const onFinish = (values: { hideRichText: string, isOpen: boolean, mail: string, name: string, verifyCode: string }) => {
        const { verifyCode, name, mail } = values
        setFormData({ ...formData, content: parseQuillContent(values.hideRichText), uuid, verifyCode, name, mail })
        PostalAPI(formDataRef.current).then(res => {
            // 设置cookies 100s后过期
            // let currentDate = new Date()
            // const expires = new Date(currentDate.getTime() + (100 * 1000))
            // document.cookie = `key=${res.data?.key}; expires=${expires}`  //注意；和expires之间有一个空格
            navigateTo(`/postal/manual?key=${res.data?.key}`)
        }).catch(err => {
            message.error(err.msg)
        }).finally(() => {
            setUuid(uuidv4())
        })
    };

    const parseQuillContent = (text: string) => {
        // 图片添加最大宽高
        text = text.replace(/<img src=/g, "<img style='max-width:max-width: 150px;max-height: 150px;vertical-align: baseline;' src=")
        // 添加ql-snow 和ql-editor 样式
        text = `<link href="https://cdn.bootcdn.net/ajax/libs/quill/1.3.7/quill.snow.css" rel="stylesheet">` + text
        text = `<div class="ql-snow"><div class="ql-editor">${text}</div></div>`
        
        return text
    }


    const onFinishFailed = (value: any) => {
        console.log(value, '---->failed');
    }

    const onChange = (e: CheckboxChangeEvent) => {
        setFormData({ ...formData, isOpen: e.target.checked })
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().endOf('day');
    };

    const dateChangeHandler: DatePickerProps['onChange'] = (date, dataString) => {
        setFormData({ ...formData, time: dataString })
    }

    const CaptchaBtn = () => {
        if (svgTag) {
            return <div dangerouslySetInnerHTML={{ __html: svgTag }} className="captchaImg" title='点击重新获取验证码'></div>
        }
        return <Button type='primary' style={{ width: '1.02rem' }} >获取验证码</Button>
    }

    return (
        <Form {...layout} labelAlign="left" form={form} name="control-hooks" onFinish={onFinish} className='postalForm' onFinishFailed={onFinishFailed} >
            <Form.Item name="name" label="你的姓名" rules={[{ required: true, message: "请填写你的名字" }, { max: 120, message: "名字不能多于120个中文字符" }]}>
                <Input placeholder='在收到邮件的标题中显示。新建列表、公开信中会自动打码隐藏' onBlur={e => form.setFieldValue('name', e.target.value.trim())} />
            </Form.Item>

            <Form.Item name="mail" label="收件邮箱" rules={[{ required: true, message: "请填写未来要收信的Email地址" }, { type: "email", message: "邮箱格式不合法" }]}>
                <Input placeholder='可以是你自己，或是任何一个你想倾诉的人。填写邮箱地址, 形如 abc@163.com' />
            </Form.Item>

            <Form.Item name="time" label="发信时间" rules={[{ required: true, message: "请输入收信时间(格式如2022-05-31 13:14)" }]}>
                <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime
                    placeholder='选择一个未来的时间（至少1天之后），信将在指定的时间寄出。时间格式 2022-05-31 13:14'
                    popupClassName={style.datePickerPopup}
                    className={style.datePickerBox}
                    placement="bottomLeft"
                    disabledDate={disabledDate}
                    showNow={false}
                    onChange={dateChangeHandler}
                />
            </Form.Item>

            <Form.Item name="isOpen" label="是否公开" className='isOpenItem'>
                <div className="FcheckChecked">
                    <Checkbox onChange={onChange}>选中后, 信的内容将 <span style={{ color: '#cc0000', fontWeight: 600 }}>立即</span> 在<span style={{ color: '#0066ff' }}>公开信</span> 中展示, 所有人都可以浏览和评论，建议 <span style={{ color: '#cc0000', fontWeight: 600 }}>不要在信件正文中透露姓名、联系方式等信息</span></Checkbox>
                </div>
            </Form.Item>

            <Link to={'/'} className={style.linkto}>邮局已经成立十年了，时光太匆匆。再过十年，又会是怎样的一个世界？</Link>

            <Form.Item name="richText">
                <RichText />
            </Form.Item>

            <Form.Item name="hideRichText" style={{ display: "none" }}>
                <Input />
            </Form.Item>

            <Form.Item style={{ textAlign: "right" }} className={style.verifyItem}>
                <Row>
                    <Col>
                        <div className="verifyImg" style={{ display: 'inline-flex', marginLeft: ".3rem" }} onClick={() => {
                            setFlag(false)
                            setUuid(uuidv4())
                        }}>
                            <CaptchaBtn />
                        </div>
                        <Form.Item style={{ display: 'inline-flex', marginLeft: ".3rem" }} className={style.btns} name="verifyCode" rules={[{ required: true, message: '验证码不能为空' }]} >
                            <Input placeholder="输入验证码" style={{ width: "2.8rem", borderRadius: ".04rem" }} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: ".3rem", width: "2.8rem", backgroundColor: "#337ab7", borderRadius: ".04rem", borderColor: "#337ab7" }}>
                            提交
                        </Button>
                    </Col>
                </Row>
            </Form.Item>
        </Form >
    );
};

export default PostalForm;