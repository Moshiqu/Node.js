import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React, { useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import style from "@/views/Postal/postal.module.scss"
import "@/views/Postal/postal.less"
import { useNavigate } from 'react-router';
import { Outlet, useLocation } from 'react-router-dom';
import Poster from "@/assets/imgs/postal/header.jpg"

const { Header, Content, Footer, } = Layout;

const navItem: MenuProps['items'] = [
    {
        key: '/postal/write',
        label: "写一封信"
    }, {
        key: '/postal/mail',
        label: "公开信"
    }, {
        key: 'random',
        label: "随机阅读一封公开信"
    }, {
        key: 'list',
        label: "信件列表"
    }, {
        key: 'tools',
        label: "邮件工具",
        icon: <DownOutlined />,
        className: style.dropDownBtn,
        theme: "light",
        popupClassName: style.dropDownDiv,
        children: [
            {
                key: '/postal/manual',
                label: '手动提取'
            }, {
                key: 'cancel',
                label: '取消公开信'
            }, {
                key: 'reissue',
                label: '补发邮件'
            },
        ]
    },
];

const Postal: React.FC = () => {
    const navigateTo = useNavigate()

    const location = useLocation().pathname

    useEffect(() => {
        document.title = "这是个啥时光邮局"
    }, [])


    const logoClick = () => {
        navigateTo('/')
    }

    const menuClick = (e: { key: string }) => {
        navigateTo(e.key)
    }

    return (
        <Layout id='postalPage'>
            <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
                <span className={style.logo} onClick={logoClick} >时光邮局</span>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[location]} items={navItem} onClick={menuClick} />
            </Header>
            <Content>
                <img src={Poster} alt='' style={{ width: '100%' }} />
                <Outlet />
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )
};

export default Postal;