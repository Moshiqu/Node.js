/*
 * @lastTime: 2021-03-05 15:29:11
 * @Description: 同步hooks
 */

import { useEffect, useState, useCallback, useRef } from 'react'

const useSyncCallback = (callback: Function) => {
    const [proxyState, setProxyState] = useState({ current: false })

    const Func = useCallback(() => {
        setProxyState({ current: true })
    }, [proxyState])

    useEffect(() => {
        if (proxyState.current === true) setProxyState({ current: false })
    }, [proxyState])

    useEffect(() => {
        proxyState.current && callback()
    })

    return Func
}

/*
 * @lastTime: 2023-07-17 02:20:27
 * @Description: interval 调用
 */
const useInterval = (callback: Function, time = 1000) => {
    const cbRef = useRef<Function>();
    useEffect(() => {
        cbRef.current = callback;
    });
    useEffect(() => {
        const callback = () => {
            cbRef.current?.();
        };
        const timer = setInterval(() => {
            callback();
        }, time);
        return () => clearInterval(timer);
    }, [time]);
}

export {
    useSyncCallback,
    useInterval
}
/*
 * @lastTime: 2021-02-26 15:29:11
 * @param: callback为回调函数
 * @Description: 用法 const newFunc = useSyncCallback(yourCallback)
 */