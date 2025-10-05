import request from '@/utils/request'

/**
 * 查看通知（学生端）
 * GET /api/user/student/getMessage
 * 无参，后端从 token 解析 userId
 */
export const apiGetNotice = () => request.get('/api/user/student/getMessage')