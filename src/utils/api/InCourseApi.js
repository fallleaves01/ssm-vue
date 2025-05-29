import request from '@/utils/request'


export function postProblem(obj) {
    return request({
        url: '/problem/postProblem',
        method: 'post',
        data: obj,

    })
}

export function GetProblem(obj){

    return request({
        url: '/problem/getPostProblem',
        method: 'get',
        params: obj,
    })
}

export function answerProblem(obj) {
    return request({
        url: '/problem/answerProblem',
        method: 'post',
        data: obj,

    })
}

export function GetCommunication(obj){

    return request({
        url: '/problem/getRandomCommunication',
        method: 'get',
        params: obj,
    })
}

export function GetAllAnswer(obj){

    return request({
        url: '/problem/getAttendCourseAnswer',
        method: 'get',
        params: obj,
    })
}

export function offClass(obj){

    return request({
        url: '/problem/endProblem',
        method: 'get',
        params: obj,
    })
}
export function PublishAnswer(obj) {
    return request({
        url: '/problem/publicAnswer',
        method: 'post',
        data: obj,

    })
}

export function GetStuSignin(obj){

    return request({
        url: '/course/getSignIn',
        method: 'get',
        params: obj,
    })
}