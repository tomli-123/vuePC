// 这个文件, 专门用于封装本地存储操作
const KEY = 'hm-tt-pc-userinfo'

/**
 * 往本地设置用户信息 (包含token)
 */
export const setUser = (user) => {
  localStorage.setItem(KEY, JSON.stringify(user))
}

/**
 * 从本地读取用户信息 (包含token)
 */
export const getUser = () => {
  return JSON.parse(localStorage.getItem(KEY)) || {}
}

/**
 * 删除本地的用户信息
 */
export const delUser = () => {
  localStorage.removeItem(KEY)
}
