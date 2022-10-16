import request from '@/utils/request'

/**
 * 添加文章
 * @param {*} data
 * @returns
 */
export function add(data) {
  return request({
    url: '/adm/article/save',
    method: 'post',
    data
  })
}

/**
 * 列表
 * @param {*} query
 * @returns
 */
export function fetchList(query) {
  return request({
    url: '/adm/article/list',
    method: 'post',
    data: query
  })
}

/**
 * 置顶
 * @param {*} data
 * @returns
 */
export function topping(data) {
  return request({
    url: '/adm/article/topping',
    method: 'post',
    data
  })
}

/**
 * 精品设置
 * @param {*} data
 * @returns
 */
export function boutique(data) {
  return request({
    url: '/adm/article/boutique',
    method: 'post',
    data
  })
}

/**
 * 删除
 * @param {*} data
 * @returns
 */
export function del(data) {
  return request({
    url: '/adm/article/del',
    method: 'post',
    data
  })
}
