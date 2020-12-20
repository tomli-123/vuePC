/**
 * 封装所有的封面相关的请求
 */

import http from '@/utils/request.js'
/**
 * 封装封面的获取操作
 * url: /mp/v1_0/user/images
 * collect 是否请求收藏的图片, true收藏, false全部
 * page    当前页
 * per_page 每页条数, 默认值, 每页20条
 */
// 注意:
// 1. get/delete请求的参数, 在params中传递, 将来拼接到地址栏, 作为查询参数
// 2. put/patch/post请求的参数, 在data中传递, 在请求体中传递
export const reqGetImages = (paramsObj) => {
  return http({
    method: 'get',
    url: '/mp/v1_0/user/images',
    params: paramsObj || {}
  })
}

/**
 * 添加/取消收藏 (用的是一个接口)
 * id: 要收藏的图片的 id
 * collect: 布尔值, 是否收藏, true收藏, false取消收藏
 */
export const reqCollectImage = (id, collect) => {
  return http({
    method: 'put',
    url: `/mp/v1_0/user/images/${id}`,
    data: {
      collect
    }
  })
}

/**
 * 删除图片素材
 * @param {*} id 要删除的图片素材的id
 */
export const reqDeleteImage = (id) => {
  return http({
    method: 'delete',
    url: `/mp/v1_0/user/images/${id}`
  })
}
