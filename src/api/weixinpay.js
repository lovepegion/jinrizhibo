import { get, post } from '@/utils/request'
// export const _baseUrl = 'http://118.31.245.175/web/vip/business/api/'
export const _baseUrl = '/web/vip/business/api/'

// 获取微信支付单价配置
export function getPayConfig () {
  const url = '/web/vip/business/api/pay/v1/getPayConfig'
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 改变单价设置
export function updatePayConfig (value) {
  // const url = `/web/vip/business/api/pay/v1/updatePayConfig?id=${value.id}&type=${value.type}&price=${value.price}&number=${value.number}&detail=${value.detail}`
  const url = `/web/vip/business/api/pay/v1/updatePayConfig/`
  return post(url, value, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 删除支付单价
export function deletePayConfigById (id, data='') {
  const url = `/web/vip/business/api/pay/v1/deletePayConfigById?id=${id}`
  return post(url, data, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 添加充值类别
export function addPayConfig (data) {
  const url = `/web/vip/business/api/pay/v1/addPayConfig/`
  return post(url, data, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取微信支付接口
export function wxCharge (data) {
  const url = '/web/vip/business/api/wxpay/wxCharge/'
  return post(url, data, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 查询微信支付是否成功
export function getPayRechargeByOutTradeNo (outTradeNo) {
  const url = `/web/vip/business/api/pay/v1/getPayRechargeByOutTradeNo?outTradeNo=${outTradeNo}`
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取所有订单列表
export function getAllPayRecharge (data) {
  const url = `/web/vip/business/api/pay/v1/getPayRecharge?pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&payStatus=${data.payStatus}`
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取单个用户订单列表
export function getUserPayRecharge (data) {
  const url = `/web/vip/business/api/pay/v1/getPayRecharge?pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&userId=${data.userId}&payStatus=${data.payStatus}`
  return get(url).then((res) => {
    return Promise.resolve(res)
  })
}
