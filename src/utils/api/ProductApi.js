import request from '@/utils/request'

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
        params: obj,
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
        params: obj,
    })
}
