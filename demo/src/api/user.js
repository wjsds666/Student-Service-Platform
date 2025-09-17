import request from '@/utils/request'
export const apiLogin = (data) => request.post('/api/user/login', data)
export const apiReg   = (data) => request.post('/api/user/reg', data)