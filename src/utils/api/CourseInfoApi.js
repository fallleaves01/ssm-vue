import request from '@/utils/request'

export function ChangeCourseInfo(obj) {
    return request({
        url: '/course/updateCourseInfo',
        method: 'post',
        data: obj,
        /*headers: {
            'isJS' : 0
        }*/
    })
}