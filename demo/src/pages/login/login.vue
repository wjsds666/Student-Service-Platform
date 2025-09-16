<template>
  <div class="top-bar">
    <span class="title">学生服务中心</span>
  </div>

  <!-- 新增：居中容器 -->
  <div class="login-wrapper">
    <div class="login-background">
      <div class="button-container">
        <div class="student-btn" @click="setLoginType('student')">学生</div>
        <div class="admin-btn" @click="setLoginType('admin')">管理员</div>
      </div>
      <div v-if="loginType === 'student'">
        <!-- 学生登录表单内容 -->
        <form style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; flex-direction: column;">
            <label style="margin-bottom: 5px; font-size: 14px;">邮箱</label>
            <input type="email" placeholder="请输入邮箱" style="border-radius: 8px; padding: 10px;" />
          </div>
          <div style="display: flex; flex-direction: column;">
            <label style="margin-bottom: 5px; font-size: 14px;">学号</label>
            <input type="text" placeholder="请输入学号" style="border-radius: 8px; padding: 10px;" />
          </div>
          <div style="display: flex; flex-direction: column;">
            <label style="margin-bottom: 5px; font-size: 14px;">密码</label>
            <input type="password" placeholder="请输入密码" style="border-radius: 8px; padding: 10px;" />
          </div>
          <button type="submit" style="width: 100%; margin-top: 20px; padding: 12px; border-radius: 8px; background-color: var(--vt-c-indigo); color: white; border: none; cursor: pointer;">登录</button>
        </form>
      </div>
      <div v-if="loginType === 'admin'">
        <!-- 管理员登录表单内容 -->
        <form style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; flex-direction: column;">
            <label style="margin-bottom: 5px; font-size: 14px;">管理员账号</label>
            <input type="text" placeholder="请输入管理员账号" style="border-radius: 8px; padding: 10px;" />
          </div>
          <div style="display: flex; flex-direction: column;">
            <label style="margin-bottom: 5px; font-size: 14px;">密码</label>
            <input type="password" placeholder="请输入密码" style="border-radius: 8px; padding: 10px;" />
          </div>
          <button type="submit" style="width: 100%; margin-top: 20px; padding: 12px; border-radius: 8px; background-color: var(--vt-c-indigo); color: white; border: none; cursor: pointer;">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginType: 'student', // 默认显示学生登录
    };
  },
  methods: {
    setLoginType(type) {
      this.loginType = type;
    },
  },
};
</script>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(145deg, #333, #444);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 10px 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
}

.title {
  font-weight: bold;
  font-size: 24px;
}

.login-wrapper {
  height: calc(100vh - 40px); /* 减去顶部导航栏高度 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  box-sizing: border-box;
  margin-top: 40px; /* 避免与顶部导航栏重叠 */
}

.login-background {
  width: 400px;
  height: 500px;
  background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 10px 15px rgba(0, 0, 0, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
}

.button-container {
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  width: 90%;
  padding: 10px 0;
}

.student-btn, .admin-btn {
  width: 90px;
  height: 90px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(145deg, #ffffff, #e0e0e0);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 10px 15px rgba(0, 0, 0, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 10px;
}
</style>