import { get, post } from '@/utils/request'

export const _baseUrl = '/web/vip/business/api/file/v1/'

// 文件上传
export function upload (data) {
  const url = _baseUrl + 'upload'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 解析doc
export function parseDoc (data) {
  const url = _baseUrl + 'parseDoc'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}

// 校验图片尺寸
export function judgeProportion (data) {
  const url = _baseUrl + 'judgeProportion'
  return post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => {
    return Promise.resolve(res)
  })
}
