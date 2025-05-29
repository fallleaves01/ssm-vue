import request from '@/utils/request'

export function GetComments(obj){

    return request({
        url: '/forum/getComments',
        method: 'get',
        params: obj,
    })
}