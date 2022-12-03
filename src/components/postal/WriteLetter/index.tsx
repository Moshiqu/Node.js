import React from 'react';
import style from "@/components/postal/WriteLetter/WriteLetter.module.scss"
import PostalForm from '@/components/postal/PostalForm/PostalForm';


const Postal: React.FC = () => {
    return (
        <div className={style.postalContent}>
            <PostalForm />
        </div>
    )
};

export default Postal;