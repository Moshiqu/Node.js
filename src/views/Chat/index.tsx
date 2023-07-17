import React, { useEffect, useState } from 'react';
import "@/views/Chat/chat.less"
import bg0 from '@/assets/imgs/chat/bg/0.jpg'
import bg1 from '@/assets/imgs/chat/bg/1.jpg'
import bg2 from '@/assets/imgs/chat/bg/2.jpg'
import bg3 from '@/assets/imgs/chat/bg/3.jpg'
import bg4 from '@/assets/imgs/chat/bg/4.jpg'
import bg5 from '@/assets/imgs/chat/bg/5.jpg'
import bg6 from '@/assets/imgs/chat/bg/6.jpg'
import bg7 from '@/assets/imgs/chat/bg/7.jpg'
import bg8 from '@/assets/imgs/chat/bg/8.jpg'
import bg9 from '@/assets/imgs/chat/bg/9.jpg'
import { useSelector } from 'react-redux';
import DefaultImg from "@/assets/imgs/header/default-male.png"
import { RightCircleOutlined, LeftCircleOutlined } from '@ant-design/icons';

type UserInfoType = {
    avatar: null | string,
    nickname: null | string,
    account: string,
    email: string
}

type AvatarPropsType = {
    avatar: string | null
}

// 头像图片
const Avatar: React.FC<AvatarPropsType> = (props) => {
    const [avatarUrl, setAvatarUrl] = useState(DefaultImg)

    useEffect(() => {
        const { avatar } = props
        if (avatar) {
            setAvatarUrl(avatar)
        }
    }, [props])
    return <img src={avatarUrl} alt="" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
}

type FriendItemPropsType = {
    icon: string,
    title: string,
    lastTime: string,
    lastMessage: string,
}
const FriendItem: React.FC<FriendItemPropsType> = (props) => {
    const { icon, lastTime, title, lastMessage } = props
    return (
        <li className='friend-item'>
            <img src={icon} alt="" className="friend-item-icon" />
            <div className='friend-item-right'>
                <div className='friend-item-content'>
                    <div className="friend-item-content-title">
                        {title}
                    </div>
                    <div className='friend-item-content-last'>
                        {lastMessage}
                    </div>
                </div>
                <span className='friend-item-content-time'>{lastTime}</span>
            </div>
        </li>
    )
}

const Chat: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfoType>({ avatar: null, account: '', email: '', nickname: null })

    // 从redux中获取用户信息
    const { userInfo: userInfoOrigin } = useSelector((state: RootState) => ({
        userInfo: state.userInfoReducer
    }))

    useEffect(() => {
        setUserInfo(userInfoOrigin);
    }, [userInfoOrigin])

    const bgImgs = [bg0, bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9]
    let [currentBgIndex, setCurrentBgIndex] = useState(0)
    const changeBg = (isNext: boolean) => {
        let index = currentBgIndex
        if (isNext) {
            index = currentBgIndex + 1
        } else {
            index = currentBgIndex - 1
        }

        if (index < 0) {
            setCurrentBgIndex(bgImgs.length - 1)
        } else if (index > bgImgs.length - 1) {
            setCurrentBgIndex(0)
        } else {
            setCurrentBgIndex(index)
        }
        console.log(currentBgIndex);
    }

    const [friendsList, setFriends] = useState([
        { icon: '/src/assets/imgs/header/random.jpg', title: '随机聊天', lastTime: "07-17 13:36", lastMessage: '我敢', id: "321" },
        { icon: '/src/assets/imgs/header/random.jpg', title: '随机聊天', lastTime: "07-17 13:36", lastMessage: '我敢', id: "3211" }
    ])

    return (
        <div style={{ backgroundImage: `url(${bgImgs[currentBgIndex]})` }} id='chat'>
            <div className='chat-box'>
                <div className="chat-header">
                    <div className="chat-avatar">
                        <Avatar avatar={userInfo.avatar} />
                    </div>
                    <div className="chat-info">
                        <div className="chat-nickname">{userInfo.nickname || userInfo.account}</div>
                        {/* <div className="chat-isVip"></div> */}
                        <div className="chat-isVip chat-notVip"></div>
                    </div>
                </div>
                <div className="chat-container">
                    <div className="chat-friends">
                        <div className="chat-friends-title">
                            会话
                        </div>
                        <div className="chat-friends-content">
                            <ul>
                                {friendsList.map(item => <FriendItem key={item.id} {...item} />)}
                            </ul>
                        </div>
                        <div className="chat-friends-tab">

                        </div>
                    </div>
                    <div className="chat-detail">

                    </div>
                </div>
                <div className="chat-footer">
                    <LeftCircleOutlined style={{ fontSize: '20px', color: '#fff' }} className='arrIcon' onClick={() => changeBg(false)} />
                    <RightCircleOutlined style={{ fontSize: '20px', color: '#fff' }} className='arrIcon' onClick={() => changeBg(true)} />
                </div>
            </div>
        </div>
    )
}

export default Chat