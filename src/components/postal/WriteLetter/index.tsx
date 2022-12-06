import React, { useEffect } from 'react';
import style from "@/components/postal/WriteLetter/WriteLetter.module.scss"
import PostalForm from '@/components/postal/PostalForm/PostalForm';


const Postal: React.FC = () => {
    useEffect(() => {
        document.title = '这是个啥邮箱|给未来写封信'

        return () => {
            document.title = "这是个啥邮箱"
        }
    }, [])

    return (
        <div className={style.postalContent}>
            <PostalForm />
        </div>
    )
};

export default Postal;