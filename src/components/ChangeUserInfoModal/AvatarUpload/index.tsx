import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Form } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useState, useEffect } from 'react';
import { ChangeAvatarAPI } from '@/request/api';
import ImgCrop from 'antd-img-crop';
import { useSelector } from 'react-redux';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('仅支持jpg和png格式!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片不能大于2M!');
    }
    return isJpgOrPng && isLt2M;
};

const AvatarUpload: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [loadingText, setLoadingText] = useState('上传')

    // 从redux中获取用户信息
    const { userInfo } = useSelector((state: RootState) => ({
        userInfo: state.userInfoReducer
    }))

    useEffect(() => {
        const { avatar } = userInfo
        if (avatar) setImageUrl(avatar)
    }, [userInfo])

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            setLoadingText("上传中...")
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as RcFile, url => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>{loadingText}</div>
        </div>
    );

    // 获取表单实例
    const form = Form.useFormInstance();

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
            // 设置avatar字段的值
            form.setFieldValue('avatar', res.imgUrl)
            setLoadingText("上传")
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
            <ImgCrop rotate modalTitle="编辑头像" modalOk="确定" modalCancel="取消" beforeCrop={checkFileType}>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    customRequest={handleUpload}
                    accept="image/png,image/jpeg"
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </ImgCrop>

        </>
    );
};

export default AvatarUpload;