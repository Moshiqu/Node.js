const numState = {
    state: {
        num: 20
    },
    actions: {
        add1(newState: { num: number }) {
            newState.num++
        },
        add2(newState: { num: number }, action: { type: string, val: number }) {
            newState.num += action.val
        }
    }
}

export default numState