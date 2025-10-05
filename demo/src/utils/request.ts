import axios, { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

type RefreshToken = () => Promise<boolean>
type LogoutFn = () => void

const service = axios.create({
  baseURL: 'http://8.134.147.255:8081',
  timeout: 6000
})

/* 刷新令牌函数（外部注入） */
let refreshToken: RefreshToken
let logout: LogoutFn

export function setAuthHandlers(rt: RefreshToken, lg: LogoutFn) {
  refreshToken = rt
  logout = lg
}

/* 请求拦截：自动带 token */
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* 响应拦截：401 先刷新，刷新失败再退出 */
service.interceptors.response.use(
  res => res.data,
  async (err: AxiosError) => {
    const res = err.response
    if (res?.status === 401) {
      /* 尝试刷新 */
      const ok = await refreshToken()
      if (ok) {
        /* 刷新成功，重发原请求 */
        return service(err.config!)
      }
      /* 刷新失败，清场 + 跳转 */
      ElMessage.error('登录已过期')
      logout()
    } else {
      ElMessage.error((res?.data as any)?.msg || '网络错误')
    }
    return Promise.reject(err)
  }
)

export default service