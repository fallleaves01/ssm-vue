import request from '@/utils/request'

export function Register(
    user_name,
    password,
    phone,
    email,
    payment_info
) {
    let obj = {
        "user_name": user_name,
        "password": password,
        "phone": phone,
        "email": email,
        "payment_info": payment_info
    }
    return request({
        url: '/user/register',
        method: 'post',
        data: obj,
    })
}

export function Login(
    user_name,
    password
) {
    let obj = {
        "user_name": user_name,
        "password": password
    }
    return request({
        url: '/user/login',
        method: 'post',
        data: obj,
    })
}

export function GetUserInfo() {
    return request({
        url: '/user/getUserInfo',
        method: 'get',
        params: {},
    })
}

export function UpdateUserInfo(
    user_name,
    password,
    phone,
    email,
    payment_info
) {
    let obj = {
        "user_name": user_name,
        "password": password,
        "phone": phone,
        "email": email,
        "payment_info": payment_info
    }
    return request({
        url: '/user/updateUserInfo',
        method: 'post',
        data: obj,
    })
}