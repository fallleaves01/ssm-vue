import request from '@/utils/request'

/**
 * @typedef {Object} Product_info
 * @property {number} product_id - 商品ID
 * @property {string} product_name - 商品名称
 * @property {string} description - 商品描述
 * @property {string} image - 商品图片URL
 * @property {string<date-time>} create_time - 起拍价
 * @property {number} start_price - 起拍价
 * @property {number} current_price - 当前价
 * @property {string} current_bidder_name - 当前出价者姓名
 * @property {number} state - 商品状态，0:未开始, 1:竞拍中, 2:已结束
 * @property {string<date-time>} plan_start_time - 计划开始时间
 * @property {string<date-time>} start_time - 竞拍开始时间
 * @property {number} due_time - 竞拍持续时间
 * @property {string<date-time>} end_time - 竞拍结束时间
 */



export function CreateProduct(
    product_name,
    description,
    image,
    start_price,
    due_time,
    plan_start_time
) {
    let obj = new FormData();
    obj.append("product_name", product_name);
    obj.append("description", description);
    obj.append("image", image);
    obj.append("start_price", start_price);
    obj.append("due_time", due_time);
    obj.append("plan_start_time", plan_start_time);
    return request({
        url: '/product/createProduct',
        method: 'post',
        data: obj,  // 使用data而不是params传递FormData
        headers: {
            'Content-Type': 'multipart/form-data' // 明确指定为multipart/form-data
        }
    })
}

export function GetReleasedProductList() {
    return request({
        url: '/product/getReleasedProductList',
        method: 'get',
        params: {},
    })
}

export function UpdateProductInfo(
    product_id,
    product_name,
    description,
    start_price,
    due_time
) {
    let obj = {
        "product_id": product_id,
        "product_name": product_name,
        "description": description,
        "start_price": start_price,
        "due_time": due_time
    }
    return request({
        url: '/product/updateProductInfo',
        method: 'post',
        data: obj,
    })
}

export function GetBuyedProductList() {
    return request({
        url: '/product/getBuyedProductList',
        method: 'get',
        params: {},
    })
}

export function SearchBuyedProductList(key_word) {
    let obj = {
        "key_word": key_word
    }
    return request({
        url: '/product/searchBuyedProductList',
        method: 'get',
        params: obj,
    })
}

export function GetTotalProductList() {
    return request({
        url: '/product/getTotalProductList',
        method: 'get',
        params: {},
    })
}


export function SearchReleasedProductList(key_word) {
    let obj = {
        "key_word": key_word
    }
    return request({
        url: '/product/searchReleasedProductList',
        method: 'get',
        params: obj,
    })
}

export function SearchTotalProductList(key_word) {
    let obj = {
        "key_word": key_word
    }
    return request({
        url: '/product/searchTotalProductList',
        method: 'get',
        params: obj,
    })
}

export function DeleteProduct(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/product/deleteProduct',
        method: 'post',
        data: obj,
    })
}

/**
 * 根据商品id获得Product表中的信息。
 * @param {number} product_id 
 * @returns {Product_info}
 */
export function GetProductInfo(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/product/getProductInfo',
        method: 'get',
        params: obj,
    })
}