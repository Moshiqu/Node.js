import { useRoutes, useLocation, useNavigate } from "react-router-dom"
import router from "@/router";
import { useEffect } from "react";
import { message } from "antd";

import { useSelector, useDispatch } from 'react-redux';
import userInfoStatus from '@/store/UserInfo';


const NotLoginPage = () => {
    const navigateTo = useNavigate()

    useEffect(() => {
        navigateTo('/home')
        message.warn('您已经登录过了!')
        console.log('asd');
    }, [navigateTo])

    return <div></div>
}

const LoginPage = () => {
    const navigateTo = useNavigate()

    useEffect(() => {
        navigateTo('/login')
        message.warn('您还未登录,请登录后访问!')
    }, [navigateTo])

    return <div></div>
}



const BeforeRouterEnter: React.FC = () => {
    const outlet = useRoutes(router)
    const hasToken = !!localStorage.getItem('token')
    const path = useLocation().pathname

    if (hasToken && (path === '/login' || path === '/register')) {
        return <NotLoginPage />
    } else if (!hasToken && path !== '/login' && path !== '/register') {
        return <LoginPage />
    }

    return outlet
}



function App() {
    const dispatch = useDispatch()
    dispatch(userInfoStatus.asyncActions.asyncGetUserInfo as any)

    return (
        <div className="App">
            {/* 占位符组件,用于展示组件, 类似vue的router-view */}
            <BeforeRouterEnter />
        </div>
    );
}

export default App;
