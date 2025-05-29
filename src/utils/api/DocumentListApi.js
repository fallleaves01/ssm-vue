import request from '@/utils/request'


export function UploadDocument(obj) {
    return request({
        url: '/document/uploadDocument',
        method: 'post',
        data: obj,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function DocumentList(obj){

    return request({
        url: '/document/getDocumentList',
        method: 'get',
        params: obj,
    })
}
export function DownloadDocument(obj){

    return request({
        url: '/document/downloadDocument',
        method: 'get',
        params: obj,
        responseType:'blob'
    })
}

export function DeleteDocument(obj) {
    return request({
        url: '/document/deleteDocument',
        method: 'post',
        data: obj,

    })
}