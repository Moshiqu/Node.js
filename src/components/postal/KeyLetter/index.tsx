import React, { useState, useEffect} from "react"
import Poster from "@/assets/imgs/postal/header.jpg"
import { useLocation } from "react-router-dom"
import { EmailInfoAPI } from "@/request/api"
import { message, Space } from "antd"
import dayjs from "dayjs"
import style from "@/components/postal/KeyLetter/KeyLetter.module.scss"


type ParamsType = {
    [key: string]: string
}

const Key: React.FC = () => {
    const search = useLocation().search
    const [emailInfo, setEmailInfo] = useState<EmailInfoAPIReqData | undefined>()

    useEffect(() => {
        if (!search) return setEmailInfo(undefined)
        const arr = search.split("?")[1].split("&")
        const obj: ParamsType = {}
        for (let i of arr) {
            obj[i.split("=")[0]] = i.split("=")[1];  //对数组每项用=分解开，=前为对象属性名，=后为属性值
        }
        if (obj.key) {
            EmailInfoAPI({ key: obj.key }).then(res => {
                console.log(res);
                setEmailInfo(res.data)
            }).catch(err => {
                message.error(err.msg)
            })
        }
    }, [search])


    const InfoWithData: React.FC = () => {
        return (
            <Space direction="vertical" style={{ display: 'flex' }}>
                <div>邮件提交成功! 它将在<span className={style.black_bold}>{dayjs(emailInfo?.send_time).format('YYYY-MM-DD HH:mm:ss')}</span>发往<span className={style.black_bold}>{emailInfo?.destination_mail}</span></div>
                <div>你也可以保存以下提取码, 到期后在<span className={style.blue}>手动提取</span>页面获得邮件。（此页面仅你可见, 且将在<span style={{ color: "red" }}>100</span>秒后过期）</div>
                <div><span className={style.red_bold}>{emailInfo?.mail_key}</span></div>
                <div>邮件发送和手工提取两种方式不会互相影响, 只是多一种提取手段!</div>
                <div><span className={style.black_bold} style={{ fontSize: ".17rem" }}>邮件内容预览</span></div>
                <div className="ql-snow">
                <div dangerouslySetInnerHTML={{ __html: emailInfo?.content! }} className="ql-editor" ></div>
                </div>
            </Space>
        )
    }

    const InfoWithoutData: React.FC = () => {
        return (
            <div>
                123
            </div>
        )
    }

    return (
        <>
            <img src={Poster} alt='' style={{ width: '100%' }} />
            <div className={style.key_letter_content}>
                {emailInfo ? <InfoWithData /> : <InfoWithoutData />}
            </div>
        </>
    )
}

export default Key;