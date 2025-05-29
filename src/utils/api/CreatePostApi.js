import request from '@/utils/request'

export function CreatePost(obj) {
    return request({
        url: '/forum/createPost',
        method: 'post',
        data: obj,

    })
}