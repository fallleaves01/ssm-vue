import request from '@/utils/request'


/**
* POST 方法 与 GET方法  区别
*
* post==> data: obj
* get==>params: obj
*
*/
// 例如(post)：
export function login(obj) {
    return request({
        url: '/user/login',
        method: 'post',
        data: obj,
        /*headers: {
            'isJS' : 1
        }*/
    })
}
export function register(obj) {
    return request({
        url: '/user/register',
        method: 'post',
        data: obj,
        /*headers: {
            'isJS' : 0
        }*/
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