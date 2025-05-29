import request from '@/utils/request'
import { getToken } from '../../store/token'
/**
* POST 方法 与 GET方法  区别
*
* post==> data: obj
* get==>params: obj
*
*/
// 例如(post)：
export function GetInfo(obj){

    return request({
        url: '/user/getUserInfo',
        method: 'get',
        params: obj,
    })
}

export function UpdateInfo(obj){
    console.log(obj)
    return request({
        url: '/user/updateUserInfo',
        method: 'post',
        data: obj,
    })
}


    // 例如(get)：
/*
    export function getBookList(obj) {
        return request({
        url: '/book/list',
        method: 'post',
        params: obj,
    })

 */