import App from '@/App'
import Home from '@/views/Home'
import About from '@/views/About'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

const baseRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />}>
                {/* 配置用户访问 '/' 的时候, 重定向到home */}
                <Route path='/' element={<Navigate to='/home'></Navigate>}></Route>
                <Route path='/home' element={<Home />}></Route>
                <Route path='/about' element={<About />}></Route>
            </Route>
        </Routes>
    </BrowserRouter>
)

export default baseRouter
