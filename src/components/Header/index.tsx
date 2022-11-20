import { Button, Layout } from 'antd';
import React, { useState } from 'react';
import style from "@/components/Header/header.module.scss";
import Icon from "@/components/Icon"
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

const { Header } = Layout;

const HeaderView: React.FC = () => {

    const [avatarUrl, setAvatarUrl] = useState('https://pica.zhimg.com/v2-1e7a2726ba4ffd4e99060b132a70e586_l.jpg?source=32738c0c')


    const signOut = () => {
        console.log('signOut');
    }
    const items: MenuProps['items'] = [
        {
            label: <a href="https://www.antgroup.com">1st menu item</a>,
            key: '0',
        },
        {
            label: <a href="https://www.aliyun.com">2nd menu item</a>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={signOut}>退出登录</span>,
            key: '3',
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