import axios from 'axios'
// 创建axios实例
const request = axios.create({
  baseURL: 'http://liufusong.top:8899/api/private/v1/'
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 响应拦截器
request.interceptors.response.use()

// 默认导出
export default request
