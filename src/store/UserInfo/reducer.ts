import userInfoHandler from '@/store/UserInfo'

const reducer = (state = { ...userInfoHandler.state }, action: { type: string, val: UserInfoAPIResData }) => {
    const preState = JSON.parse(JSON.stringify(state))

    for (const key in userInfoHandler.actionNames) {
        if (Object.prototype.hasOwnProperty.call(userInfoHandler.actionNames, key)) {
            const element = userInfoHandler.actionNames[key];
            if (action.type === element) {
               return userInfoHandler.actions[element](preState, action)
            }
        }
    }

    return preState
}
export default reducer