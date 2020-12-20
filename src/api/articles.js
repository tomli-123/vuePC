// 文章相关的所有的请求
import http from '@/utils/request.js'

/**
 * 查询文章
 * status 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
 * channel_id 频道 id，不传为全部
 * begin_pubdate 2019-01-01起始时间，不传就不限定开始时间
 * end_pubdate 2019-01-02截止时间，不传就不限定结束时间
 * page 页数，默认是 1
 * per_page 每页数量，默认每页 10 条
 * response_type 返回数据的字段，不传返回用于内容管理的字段，传 comment 返回用于评论管理的字段，传 statistic 返回用于图文数据的字段
 */
export const reqGetArticles = (queryObj) => {
  // get请求的参数, 在params中传递, 会在地址栏拼接
  return http({
    method: 'get',
    url: '/mp/v1_0/articles',
    params: queryObj || {}
  })
}

/**
 * 获取文章频道列表数据
 */
export const reqGetChannels = () => {
  return http({
    method: 'get',
    url: '/mp/v1_0/channels'
  })
}

/**
 * 删除文章
 */
export const reqDeleteArticle = (id) => {
  return http({
    method: 'delete',
    url: `/mp/v1_0/articles/${id}`
  })
}

/**
 * 发表文章
 * draft 布尔值, 是否为草稿, true草稿, false正式发布
 * articleObj
      title: '', // 文章标题
      content: '', // 文章内容
      channel_id: '', // 频道id
      cover: {
        type: 0, // 封面类型, 无图 0
        images: [] // 空数组, 无图
      }
 */
export const reqAddArticle = (draft, articleObj) => {
  return http({
    method: 'post',
    url: '/mp/v1_0/articles',
    params: {
      draft
    },
    data: articleObj
  })
}

/**
 * 根据 id 获取指定文章的详情信息
 */
export const reqGetArticleById = (id) => {
  return http({
    method: 'get',
    url: `/mp/v1_0/articles/${id}`
  })
}

/**
 * 根据 id 修改指定文章
 * id: 修改的文章的id
 * draft: 是否草稿, 布尔值
 * data: 文章信息对象
 */
export const reqEditArticle = (id, draft, data) => {
  return http({
    method: 'put',
    url: `/mp/v1_0/articles/${id}`,
    params: {
      draft
    },
    data
  })
}
