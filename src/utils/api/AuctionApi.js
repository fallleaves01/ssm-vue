import request from '@/utils/request'

export function Bid(bid_price, user_name, product_id) {
    let obj = {
        "bid_price" : bid_price,
        "user_name": user_name,
        "product_id": product_id
    };
    return request({
        url: '/auction/bid',
        method: 'post',
        data: obj,
    })
}

export function GetBuyerAuctionList(user_name) {
    let obj = {
        "user_name": user_name,
    };
    return request({
        url: '/auction/getBuyerAuctionList',
        method: 'get',
        params: obj,
    })
}

export function EnterAuction(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/auction/enterAuction',
        method: 'post',
        data: obj,
        /*headers: {
            'isJS' : 0
        }*/
    })
}

export function StartAuction(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/auction/startAuction',
        method: 'post',
        data: obj,
    })
}

/**
 * 结束竞拍
 * @param {number} product_id 
 * @returns {number} - 0成功结束，1不在竞拍时段，2无效的商品id(商品不存在或者不属于当前卖家)
 */
export function EndAuction(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/auction/endAuction',
        method: 'post',
        data: obj,
    })
}

export function GetAuctionInfo(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/auction/getAuctionInfo',
        method: 'get',
        params: obj,
    })
}