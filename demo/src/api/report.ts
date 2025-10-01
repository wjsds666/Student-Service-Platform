import request from "@/utils/request";

// 标记为垃圾
export const apiReportPost = (data) =>
  request.post("/api/user/admin/report", data);

// 查看标记记录（垃圾审核列表）
export const apiGetReports = () => request.get("/api/user/admin/report");

// 编辑头像（form-data）
export const apiUpdateAvatar = (fd) =>
  request.put("/api/user/admin/report", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 超级管理员立即删除帖子（approval=1）
export const apiDeletePostBySuper = (params) =>
  request.delete('/api/user/admin/delete', { params });

// 超管获取全部举报列表（审核标记）
export const apiGetReportsForAudit = () =>
  request.get('/api/user/admin/report/audit');

// 管理员/超管撤销接单（取消接单）
export const apiRevokeOrder = (params) =>
  request.put('/api/user/admin/delete_accept', null, { params });
// 审核举报  approval: 1=通过(删除)  2=驳回
export const apiAuditReport = (params) =>
  request.put('/api/user/admin/report', null, { params });