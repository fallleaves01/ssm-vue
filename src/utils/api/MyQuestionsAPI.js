import request from '@/utils/request'

export function GetMyquestionList(obj){

    return request({
        url: '/problem/getProblemList',
        method: 'get',
        params: obj,
    })
}