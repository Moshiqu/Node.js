import { UserInfoAPI } from "@/request/api";
type UserInfo = {
    state: {},
    actions: { [key: string]: (newState: newState, action: Action) => void },
    asyncActions: { [key: string]: (dispatch: Function) => void },
    actionNames?: { [key: string]: string }
};

type newState = {
    account: string;
    email: string;
    avatar?: null | string;
    nickname?: null | string;
}

type Action = {
    type: string,
    val: newState
}

type ActionNames = {
    [key: string]: string
}

const store: UserInfo = {
    state: {
        account: "",
        email: "",
        avatar: "",
        nickname: "",
    },
    actions: {
        getUserInfo(newState, action) {
            newState = action.val
            return newState
        },
    },
    asyncActions: {
        asyncGetUserInfo(dispatch) {
            // 获取用户信息 保存在store中
            UserInfoAPI().then(res => {
                return dispatch({ type: 'getUserInfo', val: res.data })
            }).catch(err => {
                localStorage.removeItem('token')
            })
        }
    }
};

const actionNames: ActionNames = {}

for (const key in store.actions) {
    actionNames[key] = key
}

store.actionNames = actionNames

export default store;
