import request from '@/utils/request'

/* ===================== 举报 / 审核 ===================== */

/**
 * 1. 标记帖子为垃圾（普通管理员）
 * PUT /api/user/admin/report
 * body: { userId, postId, reason }
 */
export const apiReportPost = (
  userId: number,
  postId: number,
  reason: string
) =>
  request.put('/api/user/admin/report', { userId, postId, reason })

/**
 * 2. 查看举报记录（超级管理员列表）
 * GET /api/user/admin/report
 * 无参
 */
export const apiGetReports = () =>
  request.get('/api/user/admin/report')

/**
 * 3. 超级管理员审核举报
 * DELETE /api/user/admin/report
 * body: { userId, reportId, approval }  approval: 1=同意 2=驳回
 */
export const apiAuditReport = (
  userId: number,
  reportId: number,
  approval: 1 | 2
) =>
  request.delete('/api/user/admin/report', {
    data: { userId, reportId, approval }
  })

/**
 * 4. 超级管理员立即删帖
 * DELETE /api/user/admin/delete
 * query: { postId }
 */
export const apiDeletePostBySuper = (postId: number) =>
  request.delete('/api/user/admin/delete', { params: { postId } })

/**
 * 5. 撤销接单（管理员）
 * PUT /api/user/admin/delete_accept
 * body: { userId, postId }
 */
export const apiRevokeOrder = (userId: number, postId: number) =>
  request.put('/api/user/admin/delete_accept', { userId, postId })
// 如果本来就有 apiGetReports，就换个别名导出
export const apiGetReportsForAudit = (userId: number) =>
  request.get('/api/user/admin/report', { params: { userId } })