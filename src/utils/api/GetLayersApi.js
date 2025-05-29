import request from '@/utils/request'

export function GetLayers(obj){

    return request({
        url: '/forum/getLayers',
        method: 'get',
        params: obj,
    })
}