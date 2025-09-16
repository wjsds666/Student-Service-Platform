<template>
  <div class="top-bar">
    <span class="title">学生服务中心</span>
  </div>

  <!-- 居中容器 -->
  <div class="login-wrapper">
    <div class="login-background">
      <!-- tab 页签 -->
      <div class="tab-container">
        <div
          class="tab-btn"
          :class="{ active: loginType === 'student' }"
          @click="setLoginType('student')"
        >学生</div>
        <div
          class="tab-btn"
          :class="{ active: loginType === 'admin' }"
          @click="setLoginType('admin')"
        >管理员</div>
      </div>

      <!-- 学生表单 -->
      <div v-if="loginType === 'student'" class="form-panel">
        <form class="login-form">
          <div class="form-group">
            <label>邮箱</label>
            <input type="email" placeholder="请输入邮箱" />
          </div>
          <div class="form-group">
            <label>学号</label>
            <input type="text" placeholder="请输入学号" />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input type="password" placeholder="请输入密码" />
          </div>
          <button type="submit" class="submit-btn">登录</button>
          <button type="button" class="submit-btn" @click="navigateToRegister">注册</button>
        </form>
      </div>

      <!-- 管理员表单 -->
      <div v-if="loginType === 'admin'" class="form-panel">
        <form class="login-form">
          <div class="form-group">
            <label>管理员账号</label>
            <input type="text" placeholder="请输入管理员账号" />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input type="password" placeholder="请输入密码" />
          </div>
          <button type="submit" class="submit-btn">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { loginType: 'student' };
  },
  methods: {
    setLoginType(type) {
      this.loginType = type;
    },
    navigateToRegister() {
      // 这里写跳转到注册页的逻辑
      console.log('跳转到注册页');
    },
  },
};
</script>

<style scoped>
/* ========= 顶部导航栏 ========= */
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

/* ========= 居中容器 ========= */
.login-wrapper {
  height: calc(100vh - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin-top: 40px;
}

.login-background {
  width: 400px;
  height: 500px;
  background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
  border-radius: 12px;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 10px 15px rgba(0, 0, 0, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
}

/* ========= tab 页签（完全圆角） ========= */
.tab-container {
  flex: 0 0 auto;
  display: flex;
  gap: 12px;
  padding: 20px; 
  height: 55px;          /* 上与顶边距离 = 20px */
  margin-bottom: 10px;    /* 增加底部外边距 */
}

.tab-btn {
  flex: 1;
  height: 38px;
  line-height: 38px;
  text-align: center;
  border-radius: 19px;      /* 完全圆角 */
  background: #dcdcdc;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.tab-btn.active {
  background: var(--vt-c-indigo);
  color: #fff;
}

/* ========= 表单区域（距离 tab 下沿也是 20px） ========= */
.form-panel {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px 10px;     /* 下留 10px，左右 20px */
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 0 0;      /* 底部不留白 */
}

.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 5px;
  font-size: 14px;
}
.form-group input {
  border-radius: 8px;
  padding: 10px;
}

/* ========= 按钮 ========= */
.submit-btn {
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--vt-c-indigo);
  color: white;
  border: none;
  cursor: pointer;
}
.submit-btn + .submit-btn {
  background-color: #7a7a7a;
}
</style>