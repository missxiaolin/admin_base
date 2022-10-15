import request from '@/utils/request'

/**
 * 登录
 * @param {*} data
 * @returns
 */
export function login(data) {
  return request({
    url: '/adm/user/login',
    method: 'post',
    data
  })
}
