import arrHandler from '@/store/ArrStatus'

const reducer = (state = { ...arrHandler.state }, action: { type: string, val: number }) => {
    const newState = JSON.parse(JSON.stringify(state))

    for (const key in arrHandler.actionNames) {
        if (Object.prototype.hasOwnProperty.call(arrHandler.actionNames, key)) {
            const element = arrHandler.actionNames[key];
            if (action.type === element) {
                arrHandler.actions[element](newState, action)
                break;
            }
        }
    }

    return newState
}
export default reducer