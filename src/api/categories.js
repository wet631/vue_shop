import request from '@/utils/request'
// 用户数据列表
export function categoriesList (params) {
  return request({
    url: 'categories',
    method: 'GET',
    params
  })
}
export function getParentCateList (params) {
  return request({
    url: 'categories',
    method: 'GET',
    params
  })
}
export function addCateList (data) {
  return request({
    url: 'categories',
    method: 'POST',
    data
  })
}
