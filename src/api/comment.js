/**
 * 评论管理
 */
import http from '@/utils/request.js'

// 文档注释
/**
 * 获取评论数据的列表
 * @param {*} page 当前页
 * @param {*} per_page 每页条数
 */
export const reqGetComments = (page, per_page) => {
  return http({
    method: 'get',
    url: '/mp/v1_0/articles',
    params: {
      page,
      per_page,
      response_type: 'comment'
    }
  })
}

/**
 * 修改文章的评论状态
 * @param {*} id 文章id
 * @param {*} allow_comment 是否允许评论(布尔值)
 */
export const reqModCommentStatus = (id, allow_comment) => {
  return http({
    method: 'put',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: id
    },
    data: {
      allow_comment
    }
  })
}
