import numHandler from "@/store/NumStatus"

const defaultState = {
    ...numHandler.state
}

const reducer = (state = defaultState, action: { type: string, val: number }) => {
    const newState = JSON.parse(JSON.stringify(state))

    switch (action.type) {
        case 'add':
            numHandler.actions.add1(newState)
            break;
        case 'add2':
            numHandler.actions.add2(newState, action)
            break;
        default:
            break;
    }
    console.log(newState);
    return newState

}

export default reducer