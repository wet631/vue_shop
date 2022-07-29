import request from '@/utils/request'

export function categoriesList () {
  return request({
    url: 'categories',
    method: 'GET'
  })
}
// 参数列表
export function cateIdList (cateId, params) {
  return request({
    url: `categories/${cateId}/attributes`,
    method: 'GET',
    params
  })
}
// 添加动态参数或者静态属性
export function AddcateIdList (Id, data) {
  return request({
    url: `categories/${Id}/attributes`,
    method: 'POST',
    data
  })
}
// 编辑
export function editcateIdList (cateId, attrId, data) {
  return request({
    url: `categories/${cateId}/attributes/${attrId}`,
    method: 'put',
    data
  })
}
