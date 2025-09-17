import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: 'http://127.0.0.1:4523/m1/7132041-6855088-default', // 👈 地址
  timeout: 6000
})

service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}` 
  }
  return config
})

service.interceptors.response.use(
  res => res.data,
  err => {
    const { response } = err
    // 统一 token 失效场景
    if (response?.status === 401 || response?.data?.code === 401) {
      ElMessage.error('登录已过期')
      useUserStore().logout() // 清缓存 + 跳登录
    } else {
      ElMessage.error(response?.data?.msg || '网络错误')
    }
    return Promise.reject(err)
  }
)

export default service