import request from '@/utils/request'

export function deleteComment(obj) {
    return request({
        url: '/forum/deleteComment',
        method: 'post',
        data: obj,

    })
}