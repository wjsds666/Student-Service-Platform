<template>
  <div class="register-container">
    <div class="form-card">
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="email">邮箱</label>
          <input type="email" id="email" v-model="registerForm.email" placeholder="请输入邮箱" required />
        </div>
        <div class="input-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="registerForm.userName" placeholder="请输入用户名" required />
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="registerForm.password" placeholder="请输入密码" required />
        </div>
        <button type="submit" class="submit-button">注册</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { apiReg } from '@/api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const registerForm = reactive({
  email: '',
  userName: '',
  password: ''
})

async function handleRegister() {
  if (!registerForm.email || !registerForm.userName || !registerForm.password) {
    ElMessage.warning('请填写完整')
    return
  }
  try {
    await apiReg(registerForm)   
    ElMessage.success('注册成功，请登录')
    router.push({ name: 'login' })
  } catch (e) {
    ElMessage.error(e?.response?.data?.msg || '注册失败')
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.form-card {
  width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #000;   /* 黑色按钮 */
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.submit-button:hover {
  background-color: #333;
}
</style>