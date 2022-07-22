import axios from 'axios'
// 创建axios实例
const request = axios.create({

})

// 请求拦截器
request.interceptors.request.use()

// 响应拦截器
request.interceptors.response.use()

// 默认导出
export default request
