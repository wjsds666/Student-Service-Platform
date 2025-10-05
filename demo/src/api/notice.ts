import request from '@/utils/request'

export const apiGetNotice = (params) => request.get('/api/user/student/getMessage', { params })
