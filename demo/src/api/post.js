import request from '@/utils/request'
export const apiGetAllPosts = (params) => request.get('/api/user/admin/getAllPosts', { params })
export const apiSelectOrders = (params) => request.get('/api/user/admin/select', { params })
export const apiAcceptPost = (data) => request.put('/api/user/admin/acceptPost', data)
export const apiReplyPost    = (data) => request.post('/api/user/admin/response', data)