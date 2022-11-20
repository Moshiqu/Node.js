type RegisterAPIReq = {
    captcha: string,
    email: string,
    password: string,
    repassword: string,
    account: string,
    uuid: string
}

type LoginAPIReq = {
    email?: string,
    account?: string,
    password: string
}

interface CaptchaAPIRes {
    status: string;
    data: {
        img: string;
        str: string;
    };
}

interface RegisterAPIRes {
    status: string;
    msg?: string;
}

interface LoginAPIRes {
    status: string;
    token?: string;
    msg?: string;
}
