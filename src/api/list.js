import request from '@/utils/request'

// 获取商品
export function goodsList (params) {
  return request({
    url: 'goods',
    method: 'GET',
    params
  })
}
// 删除商品
export function deletegoodsList (id) {
  return request({
    url: `goods/${id}`,
    method: 'delete'
  })
}
