import request from '@/utils/request'

export function orderList (params) {
  return request({
    url: 'orders',
    method: 'GET',
    params
  })
}

export function kuaidi (id) {
  return request({
    url: `/kuaidi/${id}`,
    method: 'GET'
  })
}
