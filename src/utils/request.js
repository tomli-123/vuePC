// 这个模块, 对于axios进行二次封装, 可以方便的进行自定义axios
import axios from 'axios'
import { getUser } from '@/utils/storage.js'
import JSONbig from 'json-bigint'

// 创建自定义的axios实例, 方便自定义配置 (为了得到一个你的axios)
const http = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn', // 基础地址
  transformResponse: [function (data) {
    // data => 原始的后台返回的 json 字符串数据
    // 这里的方法, 会覆盖axios默认对于返回结果的处理, 默认进行的是 JSON.parse
    // 需要进行的是 JSONbig.parse

    // 后台返回的有可能不是 json字符串, JSONbig 解析就会报错, 不合理的, 需要处理
    try {
      return JSONbig.parse(data)
    } catch (err) {
      // 如果解析不了, 说明不是json格式, 原样输出
      return data
    }
  }]
})

// console.log(http.defaults.baseURL)

// 添加请求拦截器 (所有的axios请求, 在真正被发送出去之前, 都会先经过请求拦截器)
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么,
  // config就是请求的配置对象, 修改这个对象, 将来请求就变化了
  // 需求: 在请求时, 携带token, 携带在请求头中
  const userInfo = getUser()
  if (userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// // 添加响应拦截器 (后面用)
// http.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   return response
// }, function (error) {
//   // 对响应错误做点什么
//   return Promise.reject(error)
// })

// 将来这里还可以写很多的自定义的配置
export default http
