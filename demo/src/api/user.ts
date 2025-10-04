import request from "@/utils/request";

/* ===================== 用户相关 ===================== */

/** 登录 */
export const apiLogin = (data) => request.post("/api/user/login", data);

/** 注册 */
export const apiReg = (data) => request.post("/api/user/reg", data);

/** 更新个人资料（支持头像字段 avatarUrl） */
export const apiUpdateProfile = (data) => request.put("/api/user/update", data);

/** 上传头像（form-data）
 *  @param file  File 对象
 *  @returns     Promise<{ avatarUrl: string }>
 */
export function apiUploadAvatar(file: File) {
  const fd = new FormData();
  fd.append("avatar", file);
  return request.post("/api/user/uploadAvatar", fd);
}
