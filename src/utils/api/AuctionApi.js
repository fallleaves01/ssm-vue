import request from '@/utils/request'

export function bid(obj) {
    return request({
        url: '/auction/bid',
        method: 'post',
        params: obj,
    })
}

export function getBuyerAuctionList(obj) {
    return request({
        url: '/auction/getBuyerAuctionList',
        method: 'get',
        params: obj,
    })
}

export function enterAuction(obj) {
    return request({
        url: '/auction/enterAuction',
        method: 'post',
        data: obj,
        /*headers: {
            'isJS' : 0
        }*/
    })
}

export function startAuction(obj) {
    return request({
        url: '/auction/startAuction',
        method: 'post',
        data: obj,
    })
}

export function endAuction(obj) {
    return request({
        url: '/auction/endAuction',
        method: 'post',
        data: obj,
    })
}