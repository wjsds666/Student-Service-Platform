import axios, { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

type RefreshToken = () => Promise<boolean>
type LogoutFn = () => void

let refreshToken: RefreshToken
let logout: LogoutFn

export function setAuthHandlers(rt: RefreshToken, lg: LogoutFn) {
  refreshToken = rt
  logout = lg
}

const service = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 6000
})

/* 请求拦截：注册/登录不带 Authorization，其余带 token */
service.interceptors.request.use(config => {
  const noNeed = ['/api/user/reg', '/api/user/login']
  if (noNeed.some(url => config.url!.endsWith(url))) return config   // 直接放行

  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* 响应拦截：401 先刷新，刷新失败退出；错误提示读 msg 字段 */
service.interceptors.response.use(
  res => res.data,
  async (err: AxiosError) => {
    const res = err.response
    if (res?.status === 401) {
      const ok = await refreshToken()
      if (ok) return service(err.config!)
      ElMessage.error('登录已过期')
      logout()
    } else {
      ElMessage.error((res?.data as any)?.msg || '网络错误')
    }
    return Promise.reject(err)
  }
)

export default service