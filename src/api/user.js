// 这个文件内, 存放的是所有用户相关的请求
import http from '@/utils/request.js'
// import { getUser } from '@/utils/storage.js'
/*
 * axios({
 *   method: 请求方式,
 *   url: 请求地址,
 *   data: 请求体中的参数,  post/patch/put
 *   params: 拼接在地址栏的参数,  get/delete
 *   headers: 请求头 (token令牌)
 * })
*/

// 一旦封装好了, 将来一旦接口路径发生变化, 也只需要修改这个模块中的代码即可
/**
 * 用户登录请求
 */
export const reqUserLogin = (mobile, code) => {
  return http({
    method: 'post',
    url: '/mp/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}

// 文档注释 jsDoc, /** + 回车
/**
 * 请求用户信息 (之前已写好)
 */
export const reqGetUserInfo = () => {
  return http({
    method: 'get',
    url: '/mp/v1_0/user/profile'
  })
}

/**
 * 发送请求, 进行用户信息修改
 * @param {*} data { name, intro, email }
 */
export const reqModUserInfo = (data) => {
  return http({
    method: 'patch',
    url: '/mp/v1_0/user/profile',
    data
  })
}

/**
 * 发送请求, 修改用户头像
 * @param {*} formData 收集头像的formData对象
 */
export const reqModUserImg = (formData) => {
  return http({
    method: 'patch',
    url: '/mp/v1_0/user/photo',
    // axios请求, data参数, 也支持formData的格式
    data: formData
  })
}
