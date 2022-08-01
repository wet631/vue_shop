import request from '@/utils/request'
export function getCateList () {
  return request({
    url: 'categories',
    method: 'GET'
  })
}
// 获取商品参数
export function getCAtegoriesList (id, params) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'GET',
    params
  })
}

export function getJtaiList (id, params) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'GET',
    params
  })
}

export function addgoodsList () {
  return request({
    url: 'goods',
    method: 'post'
  })
}
