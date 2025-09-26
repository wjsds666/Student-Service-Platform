import request from "@/utils/request";

export const apiLogin = (data) => request.post("/api/user/login", data);
export const apiReg = (data) => request.post("/api/user/reg", data);

// 编辑个人信息（PATCH）
export const apiUpdateProfile = (data) =>
  request.patch("/api/user/update", data);
