import request from '@/utils/request'

export function ProblemInfo(obj){

    return request({
        url: '/problem/getProblemInfo',
        method: 'get',
        params: obj,
    })
}

export function ChangeProblem(obj) {
    return request({
        url: '/problem/updateProblem',
        method: 'post',
        data: obj,

    })
}