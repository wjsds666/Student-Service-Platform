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
