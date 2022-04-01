import { get, post } from '@/utils/request'
// export const _baseUrl = 'http://118.31.245.175/web/vip/business/api/'
export const _baseUrl = '/web/vip/business/api/'

// 12月24日添加，微信分享获取ticket
export function getwxticket () {
  const url = '/web/vip/business/api/user/v1/getTicket'
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 12月4日添加，置顶/取消置顶
export function updateTopProduct (id, status, data='') {
  const url = `/web/vip/business/api/channel/v1/updateTopProduct?id=${id}&status=${status}`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded	' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 12月3日添加，添加热搜词
export function addKeyWord (keyword, data='') {
  const url = `/web/vip/business/api/channel/v1/addKeyWord?keyword=${keyword}`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded	' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 12月3日添加，删除热搜词
export function removeKeyWord (id, data='') {
  const url = `/web/vip/business/api/channel/v1/removeKeyWord?id=${id}`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded	' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 12月2日添加，获取热搜关键字
export function getKeyWord () {
  const url = '/web/vip/business/api/channel/v1/getKeyWord?currentPage=1&pageSize=999'
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 12月3日添加，推荐或者取消智播推荐
export function updateRecommend (id, status, data='') {
  const url = `/web/vip/business/api/channel/v1/updateRecommend?id=${id}&status=${status}`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded	' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 12月2日添加，获取智播推荐列表
export function getRecommend (currentPage=1, pageSize=999) {
  const url = `/web/vip/business/api/channel/v1/getRecommend?currentPage=${currentPage}&pageSize=${pageSize}`
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 删除用户视频
export function deleteWork (id, data='') {
  const url = `/web/vip/business/api/channel/v1/deleteProductById?id=${id}`
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded	' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 删除背景图片
export function deletebg (id, data='') {
  const url = `/web/vip/business/api/channel/v1/deleteFileById?id=${id}`
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
export function likeProduct (id, type, data='') {
  const url = _baseUrl + `channel/v1/actionProduct?id=${id}&type=${type}&actionType=2`
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

// 获取微信分享的token
export function getWeixinToken (params='') {
  const url = '/weixin/cgi-bin/token?grant_type=client_credential&appid=wx27e042ce1bd4eddd&secret=ae3de6d1af8fabdfbea9692c228da259'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}