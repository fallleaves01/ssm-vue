import request from '@/utils/request'

export function GetCoursePage(obj){

    return request({
        url: '/course/getCourseInfo',
        method: 'get',
        params: obj,
    })
}

export function BeginCourse(obj) {
    return request({
        url: '/course/beginCourse',
        method: 'post',
        data: obj,

    })
}

export function SignIn(obj) {
    return request({
        url: '/course/signIn',
        method: 'post',
        data: obj,

    })
}