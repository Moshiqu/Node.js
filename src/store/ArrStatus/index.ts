type arrStateType = {
    state: {},
    actions: { [key: string]: (newState: State, action: Action) => void },
    actionNames: { [key: string]: string }
}

type State = {
    arr: number[]
}

type Action = {
    type: string,
    val: number
}

const arrState: arrStateType = {
    state: {
        arr: [1, 2, 3]
    },
    actions: {
        arrPush: (newState: { arr: number[] }, action: { type: string, val: number }) => {
            newState.arr.push(action.val)
        }
    },
    actionNames: {
        arrPush: 'arrPush'
    }
}

export default arrState