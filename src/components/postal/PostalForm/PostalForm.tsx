import React from 'react';
import { Button, Form, Input, Checkbox, DatePicker } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import '@/components/postal/PostalForm/postalForm.less';
import style from '@/components/postal/PostalForm/postalForm.module.scss'
import dayjs from 'dayjs';

import type { RangePickerProps, DatePickerProps } from 'antd/es/date-picker';
import { Link } from 'react-router-dom';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },

};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const PostalForm: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log(values);
    };

    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue({
            note: 'Hello world!',
            gender: 'male',
        });
    };

    const onChange = (e: CheckboxChangeEvent) => {
        console.log(`checked = ${e.target.checked}`);
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().endOf('day');
    };

    const dateChangeHandler: DatePickerProps['onChange'] = (date, dataString) => {
        console.log(dataString);
    }

    return (
        <Form {...layout} labelAlign="left" form={form} name="control-hooks" onFinish={onFinish} className='postalForm'>
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
                    // disabledTime={disabledDateTime}
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
            
            

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button htmlType="button" onClick={onReset}>
                    Reset
                </Button>
                <Button type="link" htmlType="button" onClick={onFill}>
                    Fill form
                </Button>
            </Form.Item>
        </Form >
    );
};

export default PostalForm;