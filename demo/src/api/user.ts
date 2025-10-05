import request from '@/utils/request'

/* ===================== 用户相关 ===================== */

/** 登录
 * 请求体：{ userName, password }
 */
export const apiLogin = ({ userName, password }: {
  userName: string
  password: string
}) => request.post('/api/user/login', { userName, password })

/** 注册
 * 请求体：{ userName, password, email }
 */
export const apiReg = ({ userName, password, email }: {
  userName: string
  password: string
  email: string
}) => request.post('/api/user/reg', { userName, password, email })

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