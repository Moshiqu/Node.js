import React, { useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';//富文本样式文件
import style from '@/components/postal/RichText/RichText.module.scss';
import UploadModal from '@/components/postal/UploadModal';

import { Form } from 'antd';

const RichText: React.FC = () => {

    const UploadModalRef = useRef<any>();
    const ReactQuillRef = useRef();

    const showUploadBox = () => {
        UploadModalRef.current.changeModalVisible()
    }

    const modules = React.useMemo(() => ({
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ header: 1 }, { header: 2 }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ direction: 'rtl' }],
                [{ size: ['small', false, 'large', 'huge'] }], //字体设置
                [
                    {
                        color: [],
                    },
                ],
                [
                    {
                        background: [],
                    },
                ],
                [{ font: [] }],
                [{ align: [] }],
                ['link', 'image'], // a链接和图片的显示
            ],
            handlers: {
                'image': showUploadBox
            },
            imageDrop: true,
        },
    }), []);


    // 获取滚动条宽度
    const getScrollWidth = () => {
        const scroll = document.createElement("div");
        const scrollIn = document.createElement("div");
        scroll.appendChild(scrollIn);
        scroll.style.width = "100px";
        scroll.style.height = "50px";
        scroll.style.overflow = "scroll";
        scroll.style.marginLeft = "-100000px";
        document.body.appendChild(scroll);
        const scrollInWidth = scrollIn.offsetWidth;
        const scrollWidth = scroll.offsetWidth;
        const tmp = setTimeout(() => {
            document.body.removeChild(scroll);
            clearTimeout(tmp);
        }, 10);
        const thumbWith = (scrollWidth - scrollInWidth) / 100

        return {
            width: thumbWith ? `calc(100vw - .6rem - ${thumbWith}rem)` : `calc(100vw - .6rem)`
        }
    }

    const form = Form.useFormInstance();
    const handleChange = (value: string) => {
        form.setFieldValue('hideRichText', value)
    }

    return (
        <>
            <ReactQuill
                placeholder="请输入"
                theme="snow"
                modules={modules}
                className={style.quill}
                style={getScrollWidth()}
                onChange={handleChange}
                ref={ReactQuillRef as any}
            // defaultValue={form.getFieldValue('richText')}
            // value={form.getFieldValue('richText')}
            />
            <UploadModal onRef={UploadModalRef} ReactQuillRef={ReactQuillRef} Quill={Quill} />
        </>
    )
};

export default RichText;