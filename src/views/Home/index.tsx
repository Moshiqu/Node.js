import { Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import { Outlet, } from 'react-router-dom';
import MainMenu from '@/components/MainMenu';
import HeaderView from "@/components/Header"
import style from "@/views/Home/home.module.scss"
import "@/views/Home/home.less"

const { Content, Footer, Sider } = Layout;

const View: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }} id='homePage'>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <div className={style.logo} />
                <MainMenu />
            </Sider>
            <Layout className="site-layout">
                <HeaderView />
                <Content style={{ margin: '.16rem .16rem 0' }} className="site-layout-background">
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center', padding: 0, lineHeight: "48px" }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
};

export default View;