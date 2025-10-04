import request from "@/utils/request";

/* ===================== 举报/审核相关 ===================== */

/** 标记帖子为垃圾（学生/管理员） */
export const apiReportPost = (data) =>
  request.post("/api/user/admin/report", data);

/** 查看标记记录（管理员列表） */
export const apiGetReports = () => request.get("/api/user/admin/report");

/** 超级管理员立即删除帖子（approval=1） */
export const apiDeletePostBySuper = (params) =>
  request.delete("/api/user/admin/delete", { params });

/** 超管获取全部举报列表（审核用） */
export const apiGetReportsForAudit = () =>
  request.get("/api/user/admin/report");

/** 管理员/超管撤销接单 */
export const apiRevokeOrder = (params) =>
  request.put("/api/user/admin/delete_accept", null, { params });

/** 审核举报 1=通过(删帖) 2=驳回 */
export const apiAuditReport = (params) =>
  request.delete("/api/user/admin/report", { params });
