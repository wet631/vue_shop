import request from '@/utils/request'
// 用户数据列表
export function getUserList (params) {
  return request({
    url: 'users',
    method: 'GET',
    params
  })
}

export function getUserState (userInfo) {
  return request({
    url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
    method: 'PUT'
  })
}

export function addUser (data) {
  return request({
    url: '/users',
    method: 'POST',
    data
  })
}

export function EditUser (id) {
  return request({
    url: `/users/${id}`,
    method: 'GET'
  })
}
