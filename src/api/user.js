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

// 根据 ID 查询用户信息
export function EditUser (id) {
  return request({
    url: `/users/${id}`,
    method: 'GET'
  })
}

// 编辑用户提交
export function EditUserInfo (id, data) {
  return request({
    url: `/users/${id}`,
    method: 'PUT',
    data
  })
}
// 删除用户
export function deleteUserInfo (id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}
// 获取角色用户列表
export function getRightsRolesList () {
  return request({
    url: 'roles',
    method: 'get'
  })
}
// 分配用户角色
export function userRolesList (id, rid) {
  // console.log(this.userInfo.id)
  // console.log(this.selectRoleId)
  return request({
    url: `users/${id}/role`,
    method: 'PUT',
    data: {
      rid
    }
  })
}
