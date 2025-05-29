import request from '@/utils/request'

export function GetAllCourseList(obj){

    return request({
        url: '/course/getAllCourseList',
        method: 'get',
        params: obj,
    })
}

export function SearchCourse(obj){

    return request({
        url: '/course/searchCourse',
        method: 'get',
        params: obj,
    })
}