import { Navigate } from 'react-router-dom'
import React, { lazy } from 'react';
import NProgress from '@/components/NProgress';

import Home from '@/views/Home'
import User from "@/views/User"
import About from "@/views/About"
import Comp1 from "@/components/Comp1"
import Comp2 from "@/components/Comp2"
import Postal from "@/views/Postal"
import Key from '@/components/postal/KeyLetter';
import WriteLetter from '@/components/postal/WriteLetter';
import Mail from '@/components/postal/Mail';
import EmailDetail from '@/components/postal/EmailDetail';
import List from '@/components/postal/List';
import SearchLetter from '@/components/postal/SearchLetter';

const Login = lazy(() => import("@/views/Login"))
const Register = lazy(() => import("@/views/Register"))

const withLoaingComponent = (comp: JSX.Element) => (
    <React.Suspense fallback={<NProgress />}>
        {comp}
    </React.Suspense>
)

const router = [
    {
        path: '/',
        element: <Navigate to='/user' />,
    },
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "/about",
                element: <About />
            }, {
                path: '/user',
                element: <User />
            }, {
                path: "/page3/page301",
                element: <Comp1 />
            }, {
                path: "/page3/page302",
                element: <Comp2 />
            }
        ]
    }, {
        path: '/login',
        element: withLoaingComponent(<Login />)
    }, {
        path: '/register',
        element: withLoaingComponent(<Register />)
    }, {
        path: '/postal',
        element: <Navigate to='/postal/write' />
    }, {
        path: '/postal',
        element: withLoaingComponent(<Postal />),
        children: [
            {
                path: '*',
                element: <Navigate to='/postal/write' />,
            }, {
                path: '/postal/write',
                element: <WriteLetter />
            }, {
                path: "/postal/mail",
                element: <Mail />
            }, {
                path: "/postal/manual",
                element: <Key />
            }, {
                path: "/postal/detail",
                element: <EmailDetail />
            }, {
                path: "/postal/list",
                element: <List />
            }, {
                path: "/postal/search",
                element: <SearchLetter />
            }
        ]
    }, {
        path: '*',
        element: <Navigate to='/about' />,
    }
]
export default router
