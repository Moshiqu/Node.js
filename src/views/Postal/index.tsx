import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import style from "@/views/Postal/postal.module.scss"
import "@/views/Postal/postal.less"
import { useNavigate } from 'react-router';
import Poster from "@/assets/imgs/postal/header.jpg"
import PostalForm from '@/components/postal/PostalForm/PostalForm';

const { Header, Content, Footer, } = Layout;

const navItem: MenuProps['items'] = [
    {
        key: 'write',
        label: "写一封信"
    }, {
        key: 'open',
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
                key: 'manual',
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

    const logoClick = () => {
        navigateTo('/')
    }
    return (
        <Layout id='postalPage'>
            <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
                <span className={style.logo} onClick={logoClick} >时光邮局</span>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['write']} items={navItem} />
            </Header>
            <Content>
                <img src={Poster} alt='' style={{ width: '100%' }} />
                <div className={style.postalContent}>
                    <PostalForm />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )
};

export default Postal;