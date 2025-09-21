import request from "@/utils/request";
export const apiLogin = (data) => request.post("/api/user/login", data);
export const apiReg = (data) => request.post("/api/user/reg", data);

// 新：PATCH
export const apiUpdateProfile = (data) => request.put("/api/user/update", data);
