import request from '@/utils/request'

export function CreateProblem(obj) {
    return request({
        url: '/problem/createProblem',
        method: 'post',
        data: obj,

    })
}