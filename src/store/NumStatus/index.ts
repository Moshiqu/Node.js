type NumStateType = {
    state: {},
    actions: { [key: string]: (newState: newState, action: Action) => void },
    asyncActions: { [key: string]: (dispatch: Function) => void },
    actionNames?: { [key: string]: string }
};

type newState = {
    num: number
}

type Action = {
    type: string,
    val: number
}

type ActionNames = {
    [key: string]: string
}

const store: NumStateType = {
    state: {
        num: 20,
    },
    actions: {
        add1(newState, action) {
            newState.num++;
        },
        add2(newState, action) {
            newState.num += action.val;
        },
    },
    asyncActions: {
        asyncAdd1(dispatch) {
            setTimeout(() => {
                dispatch({ type: 'add1' })
            }, 3000);
        }
    }
};

const actionNames: ActionNames = {}

for (const key in store.actions) {
    actionNames[key] = key
}

store.actionNames = actionNames

export default store;
