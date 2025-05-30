import request from '@/utils/request'

export function GetTotalProductList(obj){

    return request({
        url: '/course/getTotalProductList',
        method: 'get',
        params: obj,
    })
}

export function SearchReleasedProductList(obj){

    return request({
        url: '/course/searchReleasedProductList',
        method: 'get',
        params: obj,
    })
}