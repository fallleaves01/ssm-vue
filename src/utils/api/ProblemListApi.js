import request from '@/utils/request'

export function ProblemList(obj){

    return request({
        url: '/problem/getCourseProblem',
        method: 'get',
        params: obj,
    })
}

export function DeleteProblem(obj) {
    return request({
        url: '/problem/deleteProblem',
        method: 'post',
        data: obj,

    })
}
export function SearchProblem(obj){

    return request({
        url: '/problem/searchCourseProblem',
        method: 'get',
        params: obj,
    })
}