import request from '@/utils/request'

export function buyproduct(obj) {
    return request({
        url: '/course/joinCourse',
        method: 'post',
        data: obj,
        /*headers: {
            'isJS' : 0
        }*/
    })
}