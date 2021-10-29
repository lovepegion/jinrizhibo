// 基于 localstorage 的缓存控制

// 兼容主站的缓存机制
export const storage = 'mystorage'

// 获取主站存储空间
export const getStorage = () => {
  let data = localStorage.getItem(storage) || '{}'
  data = JSON.parse(data) || {}
  return data.data || {}
}

// 主站获取存储
export const getItem = (key) => {
  const data = getStorage()
  return data[key]
}

// 主站设置存储
export const setItem = (key, data) => {
  let pack = getStorage()
  pack[key] = data
  localStorage.setItem(storage, JSON.stringify({ data: pack }))
}

// 设置缓存
export const set = (key, data = {}, ttl = 3600) => {
  localStorage.setItem(key, JSON.stringify({ data, time: new Date().getTime() + ttl * 1000 }))
}

// 获取缓存
export const get = (key) => {
  const data = localStorage.getItem(key)
  if (!data) return undefined
  if (!data.time || data.time > new Date().getTime()) {
    clear(key)
    return undefined
  }
  return JSON.parse(data.data)
}

// 清除缓存
export const clear = (key) => {
  localStorage.removeItem(key)
}

// 传入Promise函数，如果没有过期，则直接使用缓存，如果过期则获取Promise函数的数据进行设置
export const fetch = (func, ttl, ...args) => {
  const key = "" + func
  // console.log(key)
  const data = get(key)
  if (data) return new Promise.resolve(data)
  return func(...args).then(res => {
    set(key, res, ttl)
    return res
  })
}

export default {
  get,
  set,
  clear,
  fetch,
  getItem,
  setItem,
}
