import request from '@/utils/request'

/* ===================== 用户相关 ===================== */

/** 登录
 * 请求体：{ username, password }
 */
export const apiLogin = ({ username, password }: {
  username: string
  password: string
}) => {
  console.log('apiLogin 即将发', { username, password }) // ← 加这里
  return request.post('/api/user/login', { username, password })
}
/** 注册
 * 请求体：{ username, password, email }
 */
export const apiReg = ({ username, password, email }: {
  username: string
  password: string
  email: string
}) => request.post('/api/user/reg', { username, password, email })

/** 更新个人资料（一次改一项）
 * 请求体：{ key: 'avatar'|'sex'|'email', value: string }
 */
export const apiUpdateProfile = ({ key, value }: {
  key: 'avatar' | 'sex' | 'email'
  value: string
}) => request.put('/api/user/update', { key, value })

/** 上传头像（form-data）
 * 请求体：FormData { avatar: File, userId: number }
 */
export function apiUploadAvatar(file: File, userId: number) {
  const fd = new FormData()
  fd.append('avatar', file)
  fd.append('userId', String(userId))
  return request.post('/api/user/uploadAvatar', fd)
}