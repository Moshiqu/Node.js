import { Layout } from 'antd';
import React, { useState } from 'react';
import style from "@/components/Header/header.module.scss";

const { Header } = Layout;

const HeaderView: React.FC = () => {

    return (
        <Header className={style.header + " site-layout-background"} >
            <div>
                sfasf
            </div>
            <div className='userBox'>
                啦啦啦
            </div>
        </Header>
    );
};

export default HeaderView;