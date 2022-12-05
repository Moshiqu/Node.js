import React from 'react'
import { useLocation } from 'react-router-dom';

const EmailDetail: React.FC = () => {
    console.log(useLocation());
    const emailId = useLocation().search.split("?")[1]
    console.log(emailId);
    return (
        <div>
            123
        </div>
    )
}

export default EmailDetail