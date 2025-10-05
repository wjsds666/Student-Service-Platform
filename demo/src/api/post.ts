import request from '@/utils/request'

/* ========== 学生端 ========== */

/** 我的反馈列表
 * GET /api/user/student/post?userId= */
export const apiGetMyPosts = (userId: number) =>
  request.get('/api/user/student/post', { params: { userId } })

/** 提交反馈
 * POST /api/user/student/post
 * body: { userId, title, content, level, hide } */
export const apiSubmitPost = (data: {
  userId: number
  title: string
  content: string
  level: 1 | 2          // 1 紧急  2 不紧急
  hide: 1 | 2           // 1 匿名  2 不匿名
}) => request.post('/api/user/student/post', data)

/** 评价
 * POST /api/user/student/comment
 * body: { userId, postId, content } */
export const apiComment = (data: {
  userId: number
  postId: number
  content: string
}) => request.post('/api/user/student/comment', data)

/** 上传反馈图片（单张）
 * POST /api/user/post/uploadImage
 * form-data: { image: File, postId?: number }  */
export function apiUploadPostImage(file: File, postId?: number) {
  const fd = new FormData()
  fd.append('image', file)
  if (postId) fd.append('postId', String(postId))
  return request.post('/api/user/post/uploadImage', fd)
}

/** 学生获取通知（状态）
 * GET /api/user/student/getMessage  无参，token 解析 */
export const apiGetNotifications = () =>
  request.get('/api/user/student/getMessage')

/* ========== 管理端 ========== */

/** 全部反馈（管理/超管）
 * GET /api/user/admin/getAllPosts?userId=&state=&level= */
export const apiGetAllPosts = (params?: {
  userId?: number
  state?: 1 | 2       // 1 未接单  2 已接单
  level?: 0 | 1 | 2    // 0 垃圾  1 紧急  2 普通
}) => request.get('/api/user/admin/getAllPosts', { params })

/** 查看自己接单列表
 * GET /api/user/admin/select?userId= */
export const apiSelectOrders = (params?: {
  userId?: number
  state?: 1 | 2
}) => request.get('/api/user/admin/select', { params })
/** 接单
 * PUT /api/user/admin/acceptPost
 * body: { userId, postId } */
export const apiAcceptPost = (data: {
  userId: number
  postId: number
}) => request.put('/api/user/admin/acceptPost', data)

/** 回复
 * POST /api/user/admin/response
 * body: { userId, postId, content } */
export const apiReplyPost = (data: {
  userId: number
  postId: number
  content: string
}) => request.post('/api/user/admin/response', data)

/** 标记完成（接单结束）
 * PUT /api/user/admin/resolve?acceptanceId= */
export const apiFinishOrder = (acceptanceId: number) =>
  request.put('/api/user/admin/resolve', null, { params: { acceptanceId } })