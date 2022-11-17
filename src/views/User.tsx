import { useSelector, useDispatch } from 'react-redux';

const View = () => {
    // 获取仓库数据
    const { num } = useSelector((state: RootState) => ({
        num: state.num
    }))
    const dispatch = useDispatch()

    const changeNum = () => {
        dispatch({ type: 'add2', val: 10 })
    }

    return (
        <div className="user">
            <p>这是User页面</p>
            <h1>{num}</h1>
            <button onClick={changeNum}>按钮</button>
        </div>
    )
}

export default View