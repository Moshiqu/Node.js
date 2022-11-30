import React from 'react';
import style from "@/components/postal/WriteLetter/WriteLetter.module.scss"
import Poster from "@/assets/imgs/postal/header.jpg"
import PostalForm from '@/components/postal/PostalForm/PostalForm';


const Postal: React.FC = () => {
    return (
        <div>
            <img src={Poster} alt='' style={{ width: '100%' }} />
            <div className={style.postalContent}>
                <PostalForm />
            </div>
        </div>
    )
};

export default Postal;