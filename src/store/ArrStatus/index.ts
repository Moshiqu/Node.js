type arrStateType = {
    state: {},
    actions: { [key: string]: (newState: newState, action: Action) => void },
    actionNames: { [key: string]: string }
}

type newState = {
    arr: number[]
}

type Action = {
    type: string,
    val: number
}

type ActionNames = {
    [key: string]: string
}

const store: arrStateType = {
    state: {
        arr: [1, 2, 3]
    },
    actions: {
        arrPush: (newState: { arr: number[] }, action: { type: string, val: number }) => {
            newState.arr.push(action.val)
        }
    },
    actionNames: {}
}

const actionNames: ActionNames = {}

for (const key in store.actions) {
    actionNames[key] = key
}

store.actionNames = actionNames

export default store