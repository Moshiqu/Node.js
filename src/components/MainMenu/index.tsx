import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    UserOutlined,
    MailOutlined,
} from '@ant-design/icons';

import React, { useState } from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

type MenuItem = { label: string, key: string, icon?: React.ReactNode, children?: MenuItem[] };

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('用户', '/user', <PieChartOutlined />),
    getItem('关于', '/about', <DesktopOutlined />),
    getItem('页面', '/page3', <UserOutlined />, [
        getItem('第一页', '/page3/page301'),
        getItem('第二页', '/page3/page302'),
        getItem('Alex', '5'),
    ]),
    getItem('时光邮局', '/postal', <MailOutlined />),
    getItem('Files', '9', <FileOutlined />),
];

const View: React.FC = () => {
    const currentRoute = useLocation()

    function findKey(obj: { key: string }) {
        return currentRoute.pathname === obj.key
    }

    let firstOpenKey: string = ""

    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        if (element['children'] && element['children'].length > 1 && element['children'].find(findKey)) {
            firstOpenKey = element.key
            break
        }
    }

    const [openKeys, setOpenKeys] = useState([firstOpenKey]);
    const navigateTo = useNavigate()

    const menuClick = (e: { key: string }) => {
        navigateTo(e.key)
    }

    const handleOpenChange = (keys: string[]) => {
        setOpenKeys([keys[keys.length - 1]])
    }

    return (
        <Menu theme="dark" defaultSelectedKeys={[currentRoute.pathname]} mode="inline" items={items} onClick={menuClick} onOpenChange={handleOpenChange} openKeys={openKeys} />
    );
};

export default View