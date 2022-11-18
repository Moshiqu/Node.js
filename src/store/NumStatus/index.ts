type NumStateType = {
    state: {},
    actions: { [key: string]: (newState: State, action: Action) => void }, actionNames: { [key: string]: string }
};

type State = {
    num: number
}

type Action = {
    type: string,
    val: number
}


const numState: NumStateType = {
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
    actionNames: {
        add1: 'add1',
        add2: 'add2'
    }
};

export default numState;
