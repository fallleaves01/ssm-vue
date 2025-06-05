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
    obj.append("descreption", description);
    obj.append("image", image);
    obj.append("start_price", start_price);
    obj.append("due_time", due_time);
    obj.append("plan_start_time", plan_start_time);
    return request({
        url: '/course/createProduct',
        method: 'post',
        params: obj,
    })
}

export function GetReleasedProductList() {
    return request({
        url: '/course/getReleasedProductList',
        method: 'get',
        params: {},
    })
}

export function UpdateProductInfo(
    product_id,
    product_name,
    descreption,
    start_price,
    due_time
) {
    let obj = {
        "product_id": product_id,
        "product_name": product_name,
        "descreption": descreption,
        "start_price": start_price,
        "due_time": due_time
    }
    return request({
        url: '/course/updateProductInfo',
        method: 'post',
        params: obj,
    })
}

export function GetBuyedProductList() {
    return request({
        url: '/course/getBuyedProductList',
        method: 'get',
        params: {},
    })
}

export function SearchBuyedProductList(key_word) {
    let obj = {
        "key_word": key_word
    }
    return request({
        url: '/course/searchBuyedProductList',
        method: 'get',
        params: obj,
    })
}

export function GetTotalProductList() {
    return request({
        url: '/course/getTotalProductList',
        method: 'get',
        params: {},
    })
}


export function SearchReleasedProductList(key_word) {
    let obj = {
        "key_word": key_word
    }
    return request({
        url: '/course/searchReleasedProductList',
        method: 'get',
        params: obj,
    })
}

export function SearchTotalProductList(key_word) {
    let obj = {
        "key_word": key_word
    }
    return request({
        url: '/course/searchTotalProductList',
        method: 'get',
        params: obj,
    })
}

export function DeleteProduct(product_id) {
    let obj = {
        "product_id": product_id
    }
    return request({
        url: '/course/deleteProduct',
        method: 'get',
        params: obj,
    })
}
