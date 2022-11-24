import { Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import style from "@/components/Header/header.module.scss";
import Icon from "@/components/Icon"
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import ChangePwdModal from '@/components/ChangePwdModal';
import ChangeUserInfoModal from '@/components/ChangeUserInfoModal';

import { useSelector } from 'react-redux';

const { Header } = Layout;

const HeaderView: React.FC = () => {


    const [avatarUrl, setAvatarUrl] = useState('https://joeschmoe.io/api/v1/random')

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
            label: <span onClick={signOut}>退出登录</span>,
            key: 'signOut',
        },
    ];

    return (
        <Header className={style.header + " site-layout-background"} style={{ padding: '0 .16rem' }}>
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
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <div className={style.avatarBox}>
                                <img src={avatarUrl} alt="" />
                            </div>
                        </Space>
                    </a>
                </Dropdown>
            </div>


        </Header>
    );
};

export default HeaderView;