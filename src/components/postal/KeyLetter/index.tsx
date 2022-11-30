import React from "react"
import Poster from "@/assets/imgs/postal/header.jpg"
import { getCookie, setCookie } from "@/utils/cookies"

const Key: React.FC = () => {
    

    const cook = ()=>{
        console.log(getCookie("key"));
    }

    return (
        <>
           <img src={Poster} alt='' style={{ width: '100%' }} />
           <div>

            adadad
            <button onClick={cook}>asdf</button>
           </div>
        </>
    )
}

export default Key;