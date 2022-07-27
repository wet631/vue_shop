import request from '@/utils/request'
// 用户数据列表
export function rigthsList () {
  return request({
    url: 'rights/list',
    method: 'GET'
  })
}
