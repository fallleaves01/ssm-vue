import request from '@/utils/request'

/** * @typedef {Object} Order_info
 * @property {string} user_name - 买家用户名
 * @property {number} product_id - 商品ID
 * @property {number} final_price - 最终成交价格
 * @property {string} create_time - 订单创建时间
 * @property {string} pay_time - 支付时间
 * @property {string} receive_time - 卖家确认收到钱的时间
 * @property {string} cancel_time - 买家取消订单的时间
 * @property {number} state - 订单状态，0待支付，1已支付，2已完成，3已取消
 */

/**
 * 买家获取自己支付的账单
 * @returns {{buyer_order_list: [ Order_info ]}}
 */
export function GetBuyerOrderList() {
    return request({
        url: '/order/getBuyerOrderList',
        method: 'get',
        params: {},
    })
}

/**
 * 卖家获取自己应当收款的账单
 * @returns {{seller_order_list: [ Order_info ]}} 
 */
export function GetSellerOrderList() {
    return request({
        url: '/order/getSellerOrderList',
        method: 'get',
        params: {},
    })
}

/**
 * 买家支付待支付(竞拍中标0)的商品
 * @param {number} product_id 
 * @returns {{
 *      user_name: string,
 *      final_price: number, //最终成交价格
 *      payment_info: string, 
 *      status: integer //enum(0:'待支付',1:'已支付',2:'已完成',3:'已取消'), 订单状态
 * }}
 */
export function payOrder(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/order/payOrder',
        method: 'post',
        data: obj,
    })
}

/**
 * 买家取消待支付的订单
 * @param {number} product_id 
 * @returns {{
 *      user_name: string,
 *      status: number, //enum(0:'待支付',1:'已支付',2:'已完成',3:'已取消'), 订单状态
 * }}
 */
export function cancelOrder(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/order/cancelOrder',
        method: 'post',
        data: obj,
    })
}

/**
 * 卖家确认钱到账了。
 * @param {number} product_id 
 * @returns {{
 *      user_name: string,
 *      final_price: number, //最终成交价格
 *      status: integer //enum(0:'待支付',1:'已支付',2:'已完成',3:'已取消'), 订单状态
 * }}
 */
export function receiveOrder(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/order/receiveOrder',
        method: 'post',
        data: obj,
    })
}

/**
 * 通过product_id查询其对应的订单。
 * @param {number} product_id 
 * @returns {Order_info}
 */
export function getOrderInfo(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/order/getOrderInfo',
        method: 'get',
        params: obj,
    })
}