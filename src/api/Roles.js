import request from '@/utils/request'
// 用户数据列表
export function getRolesList () {
  return request({
    url: '/roles',
    method: 'GET'
  })
}
export function deleteRoles (role, rightId) {
  return request({
    url: `roles/${role}/rights/${rightId}`,
    method: 'delete'
  })
}

// 获取用户的数据
export function ShowRigthsList () {
  return request({
    url: '/rights/tree',
    method: 'GET'
  })
}
// 分配角色权限
export function RigthsRoles (roleId, rids) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'POST',
    data: {
      rids
    }
  })
}
