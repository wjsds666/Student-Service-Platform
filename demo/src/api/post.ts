import request from "@/utils/request";

/* ========== 学生端 ========== */
// 我的反馈列表
export const apiGetMyPosts = (userId) =>
  request.get("/api/user/student/post", { params: { userId } });

// 提交反馈
export const apiSubmitPost = (data) =>
  request.post("/api/user/student/post", data);

// 编辑个人信息（含头像）
export const apiUpdateProfile = (data) => request.put("/api/user/update", data);

// 评价
export function apiComment(data) {
  return request.post("/api/user/student/comment", data);
}

// 上传反馈图片
export function apiUploadPostImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  return request.post("/api/user/post/uploadImage", fd);
}

// 学生获取通知（状态）
export const apiGetNotifications = (userId: string) =>
  request.get("/api/user/student/getMessage", { params: { userId } });

/* ========== 管理端 ========== */
// 全部反馈
export const apiGetAllPosts = (params) =>
  request.get("/api/user/admin/getAllPosts", { params });

// 搜索订单
export const apiSelectOrders = (params) =>
  request.get("/api/user/admin/select", { params });

// 接单
export const apiAcceptPost = (data) =>
  request.put("/api/user/admin/acceptPost", data);

// 回复
export const apiReplyPost = (data) =>
  request.post("/api/user/admin/response", data);

// 审核举报
export const apiAuditReport = (data) => request.put("/api/admin/audit", data);

// 标记完成
export const apiFinishOrder = (data) =>
  request.put("/api/user/admin/resolve", data);
