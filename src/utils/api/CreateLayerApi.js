import request from '@/utils/request'

export function CreateLayer(obj) {
    return request({
        url: '/forum/createLayer',
        method: 'post',
        data: obj,

    })
}