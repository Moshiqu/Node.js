type NumStateType = {
    state: {},
    actions: { [key: string]: (newState: newState, action: Action) => void }, actionNames: { [key: string]: string }
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
        add1(newState: { num: number }, action: { type: string, val: number }) {
            newState.num++;
        },
        add2(newState: { num: number }, action: { type: string; val: number }) {
            newState.num += action.val;
        },
    },
    actionNames: {}
};

const actionNames: ActionNames = {}

for (const key in store.actions) {
    actionNames[key] = key
}

store.actionNames = actionNames

export default store;
