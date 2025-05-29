import request from '@/utils/request'

export function GetPosts(obj){

    return request({
        url: '/forum/getPosts',
        method: 'get',
        params: obj,
    })
}