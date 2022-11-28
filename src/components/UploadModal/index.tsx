import React, { useState, useImperativeHandle, useEffect } from 'react';
import { message, Modal, Upload } from 'antd';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { ChangeAvatarAPI } from '@/request/api';

import style from "@/components/UploadModal/UploadModal.module.scss"
import ImgCrop from 'antd-img-crop';

type UploadModalRef = {
    onRef: any,
    Quill: any,
    ReactQuillRef: any,
}

const UploadModal: React.FC<UploadModalRef> = (props) => {
    const { onRef, Quill, ReactQuillRef } = props

    useImperativeHandle(onRef, () => ({
        changeModalVisible: () => {
            setUploadModalVisible(true)
        },
    }));

    const [uploadLoading, setuploadLoading] = useState(false); // 图片上传loading

    const [uploadModalVisible, setUploadModalVisible] = useState(false)

    const [imageUrl, setImageUrl] = useState('')

    const imageHandler = (url: string) => {
        if (typeof ReactQuillRef.current.getEditor !== 'function') return;
        const quill = ReactQuillRef.current.getEditor()
        var range = quill.getSelection();
        let index = range ? range.index : 0;
        quill.insertEmbed(index, "image", url, Quill.sources.USER);//插入图片
        quill.setSelection(index + 1);//光标位置加1 
    };

    useEffect(() => {
        setImageUrl('')
    }, [uploadModalVisible])

    // 模态框点击确认
    const modalOk = () => {
        imageHandler(imageUrl)
        setUploadModalVisible(false)
    }

    // 图片上传之前
    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('仅支持jpeg和png格式的图片!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片不能大于2M!');
        }
        return isJpgOrPng && isLt2M;
    }

    // 图片上传 改变
    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setuploadLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setuploadLoading(false)
            setImageUrl(imageUrl);
        }
    };

    const uploadButton = (
        <div>
            {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>选择图片</div>
        </div>
    );

    const handleUpload = (options: any) => {
        const formData = new FormData();
        const { data, file, onSuccess, onError, filename } = options
        if (data) {
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });
        }

        formData.append(filename, file);
        ChangeAvatarAPI(formData as any).then(res => {
            onSuccess(res, file)
            setImageUrl(`${res.imgUrl}`)
        }).catch(onError)
    }

    const checkFileType = (file: { type: string }) => {
        const isFileValide = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isFileValide) {
            message.error('仅支持jpg和png格式!');
            return false
        }
        return true
    }

    return (
        <>
            <Modal
                title="上传图片"
                open={uploadModalVisible}
                onOk={modalOk}
                onCancel={() => setUploadModalVisible(false)}
                maskClosable={false}
                className={style.UploadModal}
                destroyOnClose
            >
                <div key={Math.random()}>
                    {/* <ImgCrop rotate modalTitle="编辑图片" modalOk="确定" modalCancel="取消" beforeCrop={checkFileType}> */}
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            customRequest={handleUpload}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    {/* </ImgCrop> */}
                </div>
            </Modal>
        </>
    )
};

export default UploadModal;