export const setCookie = (name: string, value: string | number | boolean, expiryDate: number) => {//参数：cookie的key、cookie的value、存储时间
    let currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + expiryDate)
    document.cookie = name + '=' + value + '; expires=' + currentDate  //注意；和expires之间有一个空格
}
export const getCookie = (name: string): string | boolean | number => {
    let arr = document.cookie.split('; ')//注意分号后面有一个空格
    for (let i = 0; i < arr.length; i++) {
        let arr2 = arr[i].split('=')
        if (arr2[0] === name) {
            return arr2[1]
        }
    }
    return ''
}
export const removeCookie = (name: string) => {
    setCookie(name, 1, -1)
}