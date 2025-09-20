import request from "@/utils/request";
export const apiGetAllPosts = (params) =>
  request.get("/api/user/admin/getAllPosts", { params });
export const apiSelectOrders = (params) =>
  request.get("/api/user/admin/select", { params });
export const apiAcceptPost = (data) =>
  request.put("/api/user/admin/acceptPost", data);
export const apiReplyPost = (data) =>
  request.post("/api/user/admin/response", data);
export const apiSubmitPost = (data) =>
  request.post("/api/user/student/post", data);
// src/api/post.js 末尾追加
export const apiDeletePost = (data) =>
  request.delete("/api/admin/post", { data });
export const apiGetReports = () => request.get("/api/admin/reports");
export const apiAuditReport = (data) => request.put("/api/admin/audit", data);
