// src/api/post.js  (唯一一份，已去重)
import request from "@/utils/request";

/* ========== 学生端 ========== */
export const apiGetMyPosts = (userId) =>
  request.get("/api/user/student/post", { params: { userId } });

export const apiSubmitPost = (data) =>
  request.post("/api/user/student/post", data);

export const apiUpdateProfile = (data) => request.put("/api/user/update", data);
export function apiComment(data) {
  return request.post("/api/user/student/comment", data);
}
// 上传反馈图片
export function apiUploadPostImage(file) {
  const fd = new FormData();
  fd.append("image", file); // 接口要求的字段名
  return request.post("/api/user/post/uploadImage", fd);
}

/* ========== 管理端 ========== */
export const apiGetAllPosts = (params) =>
  request.get("/api/user/admin/getAllPosts", { params });

export const apiSelectOrders = (params) =>
  request.get("/api/user/admin/select", { params });

export const apiAcceptPost = (data) =>
  request.put("/api/user/admin/acceptPost", data);

export const apiReplyPost = (data) =>
  request.post("/api/user/admin/response", data);

export const apiGetReports = () => request.get("/api/admin/reports");

export const apiAuditReport = (data) => request.put("/api/admin/audit", data);