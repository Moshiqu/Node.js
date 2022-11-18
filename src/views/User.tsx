import { useSelector, useDispatch } from 'react-redux';

const View = () => {
    // 获取仓库数据
    const { num, arr } = useSelector((state: RootState) => ({
        num: state.numReducer.num,
        arr: state.arrReducer.arr
    }))
    const dispatch = useDispatch()

    const changeNum = () => {
        dispatch({ type: 'add2', val: 10 })
    }

    const changeArr = () => {
        dispatch({ type: "arrPush", val: 4 })
    }

    return (
        <div className="user">
            <p>这是User页面</p>
            <h1>{num}</h1>
            <h1>{arr}</h1>
            <button onClick={changeNum}>按钮</button>
            <button onClick={changeArr}>按钮arr</button>
        </div>
    )
}

export default View