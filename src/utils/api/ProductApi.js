import request from '@/utils/request'

export function createProduct(obj){
    return request({
        url: '/course/createProduct',
        method: 'post',
        params: obj,
    })
}

export function getReleasedProductList(obj){
    return request({
        url: '/course/getReleasedProductList',
        method: 'get',
        params: obj,
    })
}

export function updateProductInfo(obj){
    return request({
        url: '/course/updateProductInfo',
        method: 'post',
        params: obj,
    })
}

export function getBuyedProductList(obj){
    return request({
        url: '/course/getBuyedProductList',
        method: 'get',
        params: obj,
    })
}

export function searchBuyedProductList(obj){

    return request({
        url: '/course/searchBuyedProductList',
        method: 'get',
        params: obj,
    })
}

export function getTotalProductList(obj){

    return request({
        url: '/course/getTotalProductList',
        method: 'get',
        params: obj,
    })
}


export function searchReleasedProductList(obj){

    return request({
        url: '/course/searchReleasedProductList',
        method: 'get',
        params: obj,
    })
}

export function searchTotalProductList(obj){

    return request({
        url: '/course/searchTotalProductList',
        method: 'get',
        params: obj,
    })
}

export function deleteProduct(obj){

    return request({
        url: '/course/deleteProduct',
        method: 'get',
        params: obj,
    })
}
