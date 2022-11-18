import Home from '@/views/Home'
import { Navigate } from 'react-router-dom'
import React, { lazy } from 'react';

const User = lazy(() => import("@/views/User"));
const About = lazy(() => import("@/views/About"));
const Login = lazy(() => import("@/views/Login"))
const Register = lazy(() => import("@/views/Register"))

const Comp1 = lazy(() => import("@/components/Comp1"))
const Comp2 = lazy(() => import("@/components/Comp2"))

const withLoaingComponent = (comp: JSX.Element) => (
    <React.Suspense fallback={<div>Loding...</div>}>
        {comp}
    </React.Suspense>
)

const router = [
    {
        path: '/',
        element: <Navigate to='/register' />,
    },
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "/about",
                element: withLoaingComponent(<About />)
            }, {
                path: '/user',
                element: withLoaingComponent(<User />)
            }, {
                path: "/page3/page301",
                element: withLoaingComponent(<Comp1 />)
            }, {
                path: "/page3/page302",
                element: withLoaingComponent(<Comp2 />)
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '*',
        element: <Navigate to='/about' />,
    }
]
export default router
