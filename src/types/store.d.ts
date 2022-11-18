// import store from "@/store"

//TS 提供ReturnType, 用来获取函数类型的返回值
type RootState = ReturnType<typeof import("@/store").getState>

type RegisterType = {
    captcha: string,
    email: string,
    password: string,
    repassword: string,
    account: string,
    uuid: string
}