import React from 'react'
import ReactDOM from 'react-dom/client'
import 'reset-css'
import '@/assets/style/global.scss'
import App from '@/App'
import { BrowserRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/dist/locale/zh-cn'

// 状态管理 
import { Provider } from 'react-redux';
import store from '@/store'

moment.locale('zh-cn');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ConfigProvider locale={zh_CN}>
                    <App />
                </ConfigProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)
