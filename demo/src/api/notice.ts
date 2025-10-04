import request from '@/utils/request'

// 学生拉取系统通知列表
export const apiGetNotices = (params) =>
  request.get('/api/user/student/getMessage', { params })

