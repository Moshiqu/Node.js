import numHandler from "@/store/NumStatus";

const reducer = (state = { ...numHandler.state }, action: { type: string; val: number }) => {
    const newState = JSON.parse(JSON.stringify(state));


    for (const key in numHandler.actionNames) {
        if (Object.prototype.hasOwnProperty.call(numHandler.actionNames, key)) {
            const element = numHandler.actionNames[key];
            if (action.type === element) {
                numHandler.actions[element](newState, action)
            }
        }
    }
    return newState;
};

export default reducer;
