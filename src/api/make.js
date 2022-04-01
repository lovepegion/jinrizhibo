import { get, post } from '@/utils/request'

export const _baseUrl = '/web/vip/business/api/'

// 根据栏目查询栏目下的作品列表
export function getProductByPage (params) {
  const url = _baseUrl + 'channel/v1/getProductByPage'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 关键词查询作品（首页关键词搜索）
export function getProductTitleByKeyWord (params) {
  const url = _baseUrl + 'channel/v1/getProductTitleByKeyWord'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 新增作品搜索次数-首页热门搜索
export function addHotSearchData (param) {
  const url = _baseUrl + 'channel/v1/addHotSearchData' + param
  return post(url, null, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取栏目下的公司列表（分页查询）
export function getChannelCompany (params) {
  const url = _baseUrl + 'channel/v1/getChannelCompany'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取热搜排行榜前3名
export function getHotSearchData () {
  const url = _baseUrl + 'channel/v1/getHotSearchData'
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取作品背景音乐背景视频背景图片
export function getFileInfoByUserId (params) {
  const url = _baseUrl + 'channel/v1/getFileInfoByUserId'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取某个用户关注量和粉丝数量以及收藏量
export function getCount (params) {
  const url = _baseUrl + 'userfans/v1/getCount'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取作品详情
export function getProductDetail (params) {
  const url = _baseUrl + 'channel/v1/getProductDetail'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 合成虚拟主播视频
export function add (data) {
  const url = _baseUrl + 'vir/v1/add'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取合成视频的url地址
export function getTaskResult (data) {
  const url = _baseUrl + 'vir/v1/getTaskResult'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取音频url地址
export function getAudio (data) {
  const url = _baseUrl + 'vir/v1/getAudio'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取栏目列表
export function getAllChannel () {
  const url = _baseUrl + 'channel/v1/getAllChannel'
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 发布作品
export function sendProduct (data) {
  const url = _baseUrl + 'channel/v1/sendProduct'
  return post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取某个用户的作品（用户个人中心页面）
export function getProductByUserId (params) {
  const url = _baseUrl + 'channel/v1/getProductByUserId'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取某个用户收藏的作品（用户个人中心页面）
export function getProductByCollectionUserId (params) {
  const url = _baseUrl + 'channel/v1/getProductByCollectionUserId'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取某个用户关注的用户列表
export function getAllFollow (params) {
  const url = _baseUrl + 'userfans/v1/getAllFollow'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取某个用户的粉丝列表
export function getAllFans (params) {
  const url = _baseUrl + 'userfans/v1/getAllFans'
  return get(url, params).then((res) => {
    return Promise.resolve(res)
  })
}

// 关注用户或者取消关注用户
export function follow (data) {
  const url = _baseUrl + 'userfans/v1/follow'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 收藏作品或者取消作品
export function collectionProduct (data) {
  const url = _baseUrl + 'channel/v1/collectionProduct'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}
