import { get, post } from '@/utils/request'

export const _baseUrl = '/web/vip/business/api/user/v1/'

// 发送短信接口
export function sms (data) {
  const url = _baseUrl + 'sms'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 注册接口
export const register = (data) => post(_baseUrl + 'register', data)

// 手机号密码登录
export function pwdLogin (data) {
  const url = _baseUrl + 'pwdLogin'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取用户信息
export function getUserInfo () {
  const url = _baseUrl + 'getUserInfo'
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 重置密码
export function editPwd (data) {
  const url = _baseUrl + 'editPwd'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 手机号验证码登录
export function smsLogin (data) {
  const url = _baseUrl + 'smsLogin'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 企业认证
export function uploadCompanyInfo (data) {
  const url = _baseUrl + 'uploadCompanyInfo'
  return post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
    return Promise.resolve(res)
  })
}
// 编辑用户头像
export function editHeadImage (data) {
  const url = _baseUrl + 'editHeadImage'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded	' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 企业认证修改信息
export function updateCompanyInfo (data) {
  const url = _baseUrl + 'updateCompanyInfo'
  return post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
    return Promise.resolve(res)
  })
}
