import request from '@/utils/request'

export function deleteLayer(obj) {
    return request({
        url: '/forum/deleteLayer',
        method: 'post',
        data: obj,

    })
}