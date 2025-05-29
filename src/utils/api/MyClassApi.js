import request from '@/utils/request'

export function GetCourseList(obj){

    return request({
        url: '/course/getCourseList',
        method: 'get',
        params: obj,
    })
}

export function DeleteCourse(obj) {
    return request({
        url: '/course/deleteCourse',
        method: 'post',
        data: obj,

    })
}