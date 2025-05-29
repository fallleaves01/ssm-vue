import request from '@/utils/request'

export function deletePost(obj) {
    return request({
        url: '/forum/deletePost',
        method: 'post',
        data: obj,

    })
}