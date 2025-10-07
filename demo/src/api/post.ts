// src/api/post.ts
import request from '@/utils/request'

/* ========== 学生端 ========== */

/** 我的反馈列表 */
export const apiGetMyPosts = (userId: number) =>
  request.get('/api/user/student/post', { params: { userId } })

/** 提交反馈 */
export const apiSubmitPost = (data: {
  userId: number
  title: string
  content: string
  level: 1 | 2
  hide: 1 | 2
  image?: string
}) => request.post('/api/user/student/post', data)

/** 评价 */
export const apiComment = (data: {
  userId: number
  postId: number
  content: string
}) => request.post('/api/user/student/comment', data)

/** 上传反馈图片 */
export function apiUploadPostImage(file: File, postId: number) {
  const fd = new FormData()
  fd.append('image', file)
  fd.append('postId', String(postId))
  return request.post('/api/user/post/uploadImage', fd)
}

/** 学生通知 */
export const apiGetNotifications = () =>
  request.get('/api/user/student/getMessage')

/* ========== 管理端 ========== */

/** 全部反馈（管理/超管） */
export const apiGetAllPosts = (params?: {
  userId?: number
  state?: 1 | 2
  level?: 0 | 1 | 2
}) => request.get('/api/user/admin/getAllPosts', { params })

/** 我的接单列表（Token 解析，不传 userId） */
export const apiSelectOrders = (params?: {
  state?: 1 | 2
}) => request.get('/api/user/admin/select', { params })

/** 接单 */
export function apiAcceptPost(postId: number, acceptanceId: number) {
  return request({
    url: '/api/user/admin/acceptPost',
    method: 'put',
    params: { postId },
    data: { acceptanceId }
  })
}

/**
 * 回复帖子（JSON 体：userId + content + postId）
 */
export const apiReplyPost = (data: {
  userId: number
  postId: number
  content: string
}) => request.post('/api/user/admin/response', data)

/**
 * 结束接单（Param：acceptanceId）
 */
export const apiFinishOrder = (acceptanceId: number) =>
  request.put('/api/user/admin/resolve', null, { params: { acceptanceId } })

/* ========== 举报 ========== */

/**
 * 标记帖子（JSON：userId + postId + reason）
 */
export const apiReportPost = (
  userId: number,
  postId: number,
  reason: string
) => request.put('/api/user/admin/report', { userId, postId, reason })

/**
 * 撤销接单（Param：acceptanceId）
 */
export const apiRevokeOrder = (acceptanceId: number) =>
  request.put('/api/user/admin/delete_accept', null, { params: { acceptanceId } })