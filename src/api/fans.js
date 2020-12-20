/**
 * 粉丝管理
 */
import http from '@/utils/request.js'

/**
 * 获取粉丝列表
 * @param {*} page 当前页
 * @param {*} per_page 每页条数
 */
export const reqGetFans = (page, per_page) => {
  return http({
    method: 'get',
    url: '/mp/v1_0/followers',
    params: {
      page,
      per_page
    }
  })
}

/**
 * 获取粉丝图表, 需要的数据
 */
export const reqGetFansStatistics = () => {
  return http({
    method: 'get',
    url: '/mp/v1_0/statistics/followers'
  })
}
