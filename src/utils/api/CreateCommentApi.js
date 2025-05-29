import request from '@/utils/request'

export function CreateComment(obj) {
    return request({
        url: '/forum/createComment',
        method: 'post',
        data: obj,

    })
}