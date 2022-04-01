import axios from 'axios'
import store from '@/store'
import router from '@/router'
import * as _ from 'lodash/get'

// 请求拦截器
axios.interceptors.request.use(
  config => {
    config.headers['Cache-Control'] = 'no-cache'
    config.headers.platform = 'web'
    // 请求头添加认证信息
    if (store.state.userInfo && store.state.userInfo.token) {
      config.headers.token = store.state.userInfo.token
      config.headers.userId = store.state.userInfo.id
    }
    //  Generate cancel token source
    let source = axios.CancelToken.source()
    // Set cancel token on this request
    config.cancelToken = source.token
    // Add to vuex to make cancellation available from anywhere
    store.commit('ADD_CANCEL_TOKEN', source)
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {
    const code = parseInt(_(response, 'data.message.code'))
    // 处理令牌无效情况
    /* if (code === -1 || code === 1001) {
      store.commit('LOG_OUT', {})
      router.push({
        path: '/user/login'
      })
    } */
    if (code === 1001) {
      store.commit('LOG_OUT', {})
      router.push({
        path: '/user/login'
      })
    }
    if (code === 1008) {
      store.commit('LOG_OUT', {})
    }
    return response
  },
  error => {
    throw error
  })

// 通用GET方法
export const get = (url, params = {}, config = {}) => {
  return axios.get(url, { params, ...config }).then(res => _(res, 'data', {}))
}

// 通用POST方法
export const post = (url, data = {}, config = {}) => {
  return axios.post(url, data, config).then(res => _(res, 'data', {}))
}

// 通用PUT方法
export const put = (url, data = {}, config = {}) => {
  return axios.put(url, data, config).then(res => _(res, 'data', {}))
}

export default {
  get,
  post,
  put,
}
