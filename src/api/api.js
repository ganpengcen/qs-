import request from '@/utils/request';

export function Post(url,data) {
    return request({
        url: url,
        method: 'post',
        data       
    })
}
export function Delete(url) {
    return request({
        url: url,
        method: 'delete',
    })
}
export function Get(url) {
    return request({
        url: url,
        method: 'get',
    })
}
export function Put(url,data) {
    return request({
        url: url,
        method: 'put',
        data       
    })
}


export function PostNoData(url) {
    return request({
        url: url,
        method: 'post',   
    })
}
export function PostBlob(url,data) {
    return request({
        url: url,
        method: 'post',
        data,
        responseType: 'blob' 
    })
}

export function Postfile(url,data) {
    return request({
        url: url,
        method: 'post',
        data,
        headers: {'Content-Type': 'multipart/form-data'},
    })
}


