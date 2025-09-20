import request from '@/utils/request'

// 标记为垃圾
export const apiReportPost = (data) => request.post('/api/user/admin/report', data)