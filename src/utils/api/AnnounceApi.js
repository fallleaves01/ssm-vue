import request from '@/utils/request'

export function AnnouncementList(obj){

    return request({
        url: '/course/getAnnouncement',
        method: 'get',
        params: obj,
    })
}

export function SendAnnouncement(obj) {
    return request({
        url: '/course/sendAnnouncement',
        method: 'post',
        data: obj,

    })
}