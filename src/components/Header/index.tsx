import { Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import Icon from "@/components/Icon"
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import ChangePwdModal from '@/components/ChangePwdModal';
import ChangeUserInfoModal from '@/components/ChangeUserInfoModal';
import style from "@/components/Header/header.module.scss";
import '@/components/Header/header.less';
import DefaultImg from "@/assets/imgs/header/default-female.png"

import { useSelector } from 'react-redux';

const { Header } = Layout;

const HeaderView: React.FC = () => {
    // const [avatarUrl, setAvatarUrl] = useState('https://joeschmoe.io/api/v1/random') // 随机头像
    const [avatarUrl, setAvatarUrl] = useState(DefaultImg)

    const navigateTo = useNavigate()

    const signOut = () => {
        localStorage.removeItem('token')
        navigateTo('/login')
    }

    // 从redux中获取用户信息
    const { userInfo } = useSelector((state: RootState) => ({
        userInfo: state.userInfoReducer
    }))

    useEffect(() => {
        const { avatar } = userInfo
        if (avatar) setAvatarUrl(avatar)
    }, [userInfo])

    const items: MenuProps['items'] = [
        {
            label: <ChangeUserInfoModal />,
            key: '0',
        },
        {
            label: <ChangePwdModal />,
            key: 'ChangePwdModal',
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={signOut} style={{ display: "block" }}>退出登录</span>,
            key: 'signOut',
        },
    ];

    return (
        <Header className={`${style.header}`} style={{ padding: '0 .16rem' }} id="headerBox">
            <div>
                sfasf
            </div>
            <div className={style.userBox}>
                <ul>
                    <li>
                        <Icon iconName='icon-lingdang' customClassName={style.notify} />
                        <span>消息</span>
                    </li>
                    <li>
                        <Icon iconName='icon-msg' customClassName={style.notify} />
                        <span>消息</span>
                    </li>
                </ul>

                <Dropdown menu={{ items }} trigger={['click']} arrow>
                    <span>
                        <Space>
                            <div className={style.avatarBox}>
                                <img src={avatarUrl} alt="" title={userInfo.nickname || userInfo.account} />
                            </div>
                        </Space>
                    </span>
                </Dropdown>
            </div>
        </Header>
    );
};

export default HeaderView;