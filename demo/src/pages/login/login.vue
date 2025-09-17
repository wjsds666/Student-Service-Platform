<template>
  <div class="top-bar">
    <span class="title">学生服务中心</span>
  </div>
  <div class="login-wrapper">
    <div class="login-background">
      <div class="tab-container">
        <div
          class="tab-btn"
          :class="{ active: loginType === 'student' }"
          @click="setLoginType('student')">
          学生
        </div>
        <div
          class="tab-btn"
          :class="{ active: loginType === 'admin' }"
          @click="setLoginType('admin')">
          管理员
        </div>
      </div>
      <div v-if="loginType === 'student'" class="form-panel">
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="loginForm.userName" type="text" placeholder="请输入用户名" />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="loginForm.password" type="password" placeholder="请输入密码" />
          </div>
          <button type="submit" class="submit-btn">登录</button>
          <button type="button" class="submit-btn" @click="navigateToRegister">注册</button>
        </form>
      </div>
      <div v-if="loginType === 'admin'" class="form-panel">
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label>管理员账号</label>
            <input v-model="loginForm.userName" type="text" placeholder="请输入管理员账号" />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="loginForm.password" type="password" placeholder="请输入密码" />
          </div>
          <button type="submit" class="submit-btn">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const loginType = reactive('student')
const loginForm = reactive({ userName: '', password: '' })

function setLoginType(type) {
  loginType = type
}

function navigateToRegister() {
  console.log('跳转到注册页')
}

async function handleLogin() {
  if (!loginForm.userName || !loginForm.password) {
    ElMessage.warning('请填写完整')
    return
  }
  try {
    await userStore.login({
      userName: loginForm.userName,
      password: loginForm.password
    })
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || '登录失败')
  }
}
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

.tab-container {
  flex: 0 0 auto;
  display: flex;
  gap: 12px;
  padding: 20px;
  height: 55px;
  margin-bottom: 10px;
}

.tab-btn {
  flex: 1;
  height: 38px;
  line-height: 38px;
  text-align: center;
  border-radius: 19px;
  background: #dcdcdc;
  color: black;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.tab-btn.active {
  background: #000; 
  color: #fff;
}

.form-panel {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px 10px;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 0 0;
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

.submit-btn {
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  border-radius: 8px;
  background: #000; 
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.submit-btn:hover {
  background: #333;
}
.submit-btn + .submit-btn { 
  background: #555;
}
.submit-btn + .submit-btn:hover {
  background: #666;
}
</style>