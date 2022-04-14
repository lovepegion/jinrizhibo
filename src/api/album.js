import { get, post } from '@/utils/request'
// export const _baseUrl = 'http://118.31.245.175/web/vip/business/api/'
export const _baseUrl = '/web/vip/business/api/'

// 获取用户专辑
export function getAlbum (data) {
  const url = _baseUrl + `album/v1/getAlbum?userId=${data.userId}&title=${data.title}&content=${data.content}&synopsis=${data.synopsis}`
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取用户专辑通过公司名
export function getAlbumBykey (key) {
  const url = _baseUrl + `album/v1/getAlbum?synopsis=${key}`
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取用户专辑通过公司名
export function getAlbumByUserId (userId) {
  const url = _baseUrl + `album/v1/getAlbum?userId=${userId}`
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 添加专辑
export function addAlbum (value) {
  // const url = `/web/vip/business/api/pay/v1/updatePayConfig?id=${value.id}&type=${value.type}&price=${value.price}&number=${value.number}&detail=${value.detail}`
  const url = _baseUrl + 'album/v1/addAlbum/'
  return post(url, value, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 专辑中添加作品
export function addProductsToAlbum (value) {
  const url = _baseUrl + 'album/v1/addProductsToAlbum/'
  return post(url, value, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取专辑详情
export function getAlbumDetail (data) {
  const url = _baseUrl + `album/v1/getAlbumDetail?albumId=${data.albumId}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 删除专辑
export function deleteAlbum (albumId, value='') {
  const url = _baseUrl + `album/v1/deleteAlbum?id=${albumId}`
  return post(url, value, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    return Promise.resolve(res)
  })
}

//更新专辑
export function updateAlbum (value) {
  const url = _baseUrl + 'album/v1/updateAlbum'
  return post(url, value, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    return Promise.resolve(res)
  })
}

//删除专辑中的作品
export function deleteProductsToAlbum (value) {
  const url = _baseUrl + 'album/v1/deleteProductsToAlbum'
  return post(url, value, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    return Promise.resolve(res)
  })
}