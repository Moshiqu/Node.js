import { useEffect } from 'react';
import style from '@/views/Login/init.module.scss'
import initLoginBg from '@/views/Login/init.js';

const View: React.FC = () => {
    useEffect(() => {
        initLoginBg()
        window.onresize = function () {
            initLoginBg()
        }
    }, [])

    return (
        <div className={style.loginPage}>
            {/* canvas背景 */}
            <canvas id="canvas" style={{ display: "block" }}></canvas>
            <div className={style.loginBox}>
                爱丽丝的肌肤
            </div>
        </div>
    )
}

export default View