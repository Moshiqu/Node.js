import { useRoutes, useLocation, useNavigate } from "react-router-dom"
import router from "@/router";
import { useEffect } from "react";
import { message } from "antd";

import { useDispatch } from 'react-redux';
import userInfoStatus from '@/store/UserInfo';

import configObj from '@/assets/js/config.js';

const NotLoginPage = () => {
    const navigateTo = useNavigate()

    useEffect(() => {
        message.warn('您已经登录过了!')
        navigateTo('/home')
    }, [navigateTo])

    return <div></div>
}

const LoginPage = () => {
    const navigateTo = useNavigate()

    useEffect(() => {
        message.warn('您还未登录,请登录后访问!')
        navigateTo('/login')
    }, [navigateTo])

    return <div></div>
}

const BeforeRouterEnter: React.FC = () => {
    const outlet = useRoutes(router)
    const hasToken = !!localStorage.getItem('token')
    const path = useLocation().pathname

    // 允许跳过登录验证的页面
    if (configObj.skipSignInArr.some((item: string) => item === path.split('/')[1])) return outlet

    // 登录验证
    if (hasToken && (path === '/login' || path === '/register')) {
        return <NotLoginPage />
    } else if (!hasToken && path !== '/login' && path !== '/register') {
        return <LoginPage />
    }

    return outlet
}

function App() {
    const path = useLocation().pathname
    const dispatch = useDispatch()
    if (path !== '/login' && path !== '/register' && !configObj.skipSignInArr.some((item: string) => item === path.split('/')[1])) {
        dispatch(userInfoStatus.asyncActions.asyncGetUserInfo as any)
    }

    return (
        <div className="App">
            {/* 占位符组件,用于展示组件, 类似vue的router-view */}
            <BeforeRouterEnter />
        </div>
    );
}

export default App;
