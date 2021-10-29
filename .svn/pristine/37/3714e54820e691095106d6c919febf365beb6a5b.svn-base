import { get, post } from '@/utils/request'
// export const _baseUrl = 'http://118.31.245.175/web/vip/business/api/'
export const _baseUrl = '/web/vip/business/api/'


// 删除用户视频
export function deleteWork (id, data='') {
  const url = `/web/vip/business/api/channel/v1/deleteProductById?id=${id}`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded	' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 发表评论
export function sendComment (data) {
  const url = _baseUrl + 'channel/v1/commentProduct'
  return post(url, data, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取评论
export function getComments (id) {
  const url = _baseUrl + `channel/v1/getCommentProduct?productId=${id}`
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 第二期收藏/取消收藏
export function collectProduct (id, type, data='') {
  const url = _baseUrl + `channel/v1/actionProduct?id=${id}&type=${type}&actionType=3`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 第二期点赞/取消点赞
export function likeProduct (id, type, actionType, data='') {
  const url = _baseUrl + `channel/v1/actionProduct?id=${id}&type=${type}&actionType=${actionType}`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}
// 第二期关注/取消关注
export function followProduct (id, type, data='') {
  const url = _baseUrl + `channel/v1/actionProduct?id=${id}&type=${type}&actionType=1`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}
// 搜索列表切换
export function getHotSearch (type) {
  const url = `http://118.31.245.175/web/vip/business/api/channel/v1/getHotSearchData?type=${type}`
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 产品上架
export function upShelf (id, data='') {
  const url = _baseUrl + `channel/v1/updateProductStatus?id=${id}&status=1`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 产品下架
export function downShelf (id, data='') {
  const url = _baseUrl + `channel/v1/updateProductStatus?id=${id}&status=3`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 管理员根据栏目查询栏目下的作品列表
export function getProductByPageWithAdmin (params) {
  const url = _baseUrl + 'channel/v1/getProductByPageWithAdmin'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}
