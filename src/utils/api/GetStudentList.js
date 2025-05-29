import request from '@/utils/request'

export function GetStudentList(obj){

    return request({
        url: '/course/getStuCourseList',
        method: 'get',
        params: obj,
    })
}

export function DeleteStudent(obj) {
    return request({
        url: '/course/deleteStudent',
        method: 'post',
        data: obj,

    })
}

export function AddStudent(obj) {
    return request({
        url: '/course/addStudent',
        method: 'post',
        data: obj,

    })
}