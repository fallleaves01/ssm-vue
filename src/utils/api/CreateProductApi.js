import request from '@/utils/request'

export function CreateCourse(obj) {
    return request({
        url: '/course/createCourse',
        method: 'post',
        data: obj,
        /*headers: {
            'isJS' : 0
        }*/
    })
}

export function UploadPic(obj) {
    return request({
        url: '/document/uploadPhoto',
        method: 'post',
        data: obj,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}