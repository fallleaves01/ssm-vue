import request from '@/utils/request'

export function GetAllAnnouncement(obj){

    return request({
        url: '/course/getAllAnnouncement',
        method: 'get',
        params: obj,
    })
}